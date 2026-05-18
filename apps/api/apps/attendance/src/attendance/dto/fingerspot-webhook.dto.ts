export class FingerspotWebhookDto {
  pin: string;
  scan_time: string; // YYYY-MM-DD HH:MM:SS
  verify_mode?: number;
  work_code?: number;
}
