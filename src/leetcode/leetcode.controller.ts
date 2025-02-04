import { Controller } from '@nestjs/common';
import { LeetCodeService } from './leetcode.service';

@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly leetcodeService: LeetCodeService) {}


  
}
