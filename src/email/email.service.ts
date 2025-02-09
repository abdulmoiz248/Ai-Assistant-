import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Imap from 'imap';
import { GeminiService } from 'src/gemini/gemini.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';

const geminiPrompt = `
You are an email summarization assistant. Your task is to analyze the following email.
If the email appears to be promotional or spam (e.g., it contains marketing language, offers, discounts, or similar ) and if it is also a linkedin connection request or anyother that is useless, respond with only the single word: delete. Otherwise, provide a concise summary of the email in 2-3 sentences. Your output should contain only either the summary or the word "delete", with no additional text.
`;

@Injectable()
export class EmailService implements OnModuleInit {
  private imap: Imap;
  private cID = process.env.CHANNEL_ID!;
  private emailPollingInterval: NodeJS.Timeout | null = null;

  constructor(
    private sendMsg: SendMsgService,
    private geminiService: GeminiService,
  ) {
    this.initializeImap();
  }

  onModuleInit() {
    this.connectToEmailServer();
  }

  // Initialize a new IMAP instance
  private initializeImap() {
    this.imap = new Imap({
      user: process.env.EMAIL_USER!,
      password: process.env.EMAIL_PASS!,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  // Connect and attach event handlers
  private connectToEmailServer() {
    this.imap.once('ready', () => {
      console.log('Connected to email server');
      this.openInbox();
    });

    this.imap.once('error', (err: Error) => {
      console.error('IMAP error:', err);
      this.handleReconnect();
    });

    this.imap.once('end', () => {
      console.log('Connection ended');
      this.clearPolling(); // stop polling on a dead connection
      this.handleReconnect();
    });

    this.imap.connect();
  }

  private openInbox() {
    this.imap.openBox('INBOX', false, (err: Error) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return;
      }
      console.log('Inbox opened');
      this.listenForEmails();
    });
  }

  private listenForEmails() {
    console.log('Listening for new emails...');

    const fetchNewEmails = () => {
      console.log('Checking for new emails...');
      this.processNewEmails();
    };

    this.imap.on('mail', (numNewEmails) => {
      console.log(`New email(s) received: ${numNewEmails}`);
      fetchNewEmails();
    });

    this.imap.on('update', (seqNo) => {
      console.log(`Email update detected: ${seqNo}`);
      fetchNewEmails();
    });

    this.imap.on('error', (err) => {
      console.error('Error in IMAP connection:', err);
    });

    // Start polling every 60 seconds and store the interval handle
    // this.emailPollingInterval = setInterval(() => {
    //   fetchNewEmails();
    // }, 60000);
  }

  // Clear the polling interval when connection dies
  private clearPolling() {
    if (this.emailPollingInterval) {
      clearInterval(this.emailPollingInterval);
      this.emailPollingInterval = null;
    }
  }

  private async processNewEmails() {
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

    this.imap.search(searchCriteria, (err: Error, results: number[]) => {
      if (err) {
        console.error('Error searching emails:', err);
        return;
      }

      if (results.length === 0) {
        console.log('No new emails to process');
        return;
      }

      const fetch = this.imap.fetch(results, fetchOptions);

      fetch.on('message', (msg, seqno) => {
        // Use promises to wait for all parts (attributes, header, and text)
        const headerPromise = new Promise<string>((resolve) => {
          let headerResolved = false;
          msg.on('body', (stream, info) => {
            if (info.which === 'HEADER' && !headerResolved) {
              headerResolved = true;
              let headerData = '';
              stream.on('data', (chunk) => {
                headerData += chunk.toString('utf8');
              });
              stream.on('end', () => resolve(headerData));
            }
          });
        });

        const textPromise = new Promise<string>((resolve) => {
          let textResolved = false;
          msg.on('body', (stream, info) => {
            if (info.which === 'TEXT' && !textResolved) {
              textResolved = true;
              let textData = '';
              stream.on('data', (chunk) => {
                textData += chunk.toString('utf8');
              });
              stream.on('end', () => resolve(textData));
            }
          });
        });

        const attributesPromise = new Promise<any>((resolve) => {
          msg.once('attributes', (attrs) => {
            resolve(attrs);
          });
        });

        Promise.all([attributesPromise, headerPromise, textPromise])
          .then(([attrs, headerData, textData]) => {
            const emailUid = attrs.uid;
            const subjectMatch = headerData.match(/Subject: (.*)/);
            const subject = subjectMatch ? subjectMatch[1].trim() : '';
            const fromMatch = headerData.match(/From: (.*)/);
            const emailFrom = fromMatch ? fromMatch[1].trim() : '';
            console.log(`Email #${seqno} - From: ${emailFrom}, Subject: ${subject}`);

            if (this.isPromotionOrSpam(subject)) {
          //    this.deleteMail(emailUid);
            } else {
              const promptText =
                geminiPrompt +
                "\nFrom: " +
                emailFrom +
                "\nSubject: " +
                subject +
                "\n\n" +
                textData;
              this.summarizeEmail_send(promptText)
                .then((summary) => {
                  console.log(`Summary for email #${seqno}:`, summary);
                  if (summary.startsWith("delete")) {
                 //   this.deleteMail(emailUid);
                  } else {
                    const msg = `
New Mail Received!!
From: ${emailFrom}
Subject: ${subject}
Summary: ${summary}
                    `;
                    this.sendSummary(msg);
                  }
                })
                .catch((err) => {
                  console.error('Error generating summary:', err);
                });
            }
          })
          .catch((err) => {
            console.error(`Error processing email #${seqno}:`, err);
          });
      });

      fetch.on('error', (err: Error) => {
        console.error('Fetch error:', err);
      });

      fetch.on('end', () => {
        console.log('Finished processing new emails');
        this.imap.expunge((err) => {
          if (err) {
            console.error('Error during expunge:', err);
          } else {
            console.log('Successfully expunged deleted emails.');
          }
        });
      });
    });
  }

  private isPromotionOrSpam(subject: string): boolean {
    const spamKeywords = [
      'promotion',
      'deal',
      'discount',
      'sale',
      'update',
      'newsletter',
      'offer',
    ];
    return spamKeywords.some((keyword) => subject.toLowerCase().includes(keyword));
  }

  private async summarizeEmail_send(promptText: string) {
    return await this.geminiService.generateGeminiContent(promptText);
  }

  // private deleteMail(emailUid: number) {
  //   if (emailUid) {
  //     this.imap.move(emailUid, '[Gmail]/Trash', (moveErr) => {
  //       if (moveErr) {
  //         console.error(`Error moving email to Trash:`, moveErr);
  //       } else {
  //         console.log(`Email moved to Trash successfully.`);
  //       }
  //     });
  //   } else {
  //     console.error(`UID not found for email, cannot move to Trash.`);
  //   }
  // }

  private async sendSummary(summary: string) {
    await this.sendMsg.sendMessage(this.cID, summary);
  }

  // Reconnect handler: create a new IMAP instance and reconnect after a delay
  private handleReconnect() {
    console.log('Reconnecting to email server in 5 seconds...');
    setTimeout(() => {
      this.initializeImap();
      this.connectToEmailServer();
    }, 5000);
  }
}
