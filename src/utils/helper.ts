import { notification } from 'antd';

export function secondsToHoursAndMinutes(seconds: number): string {
  if (!seconds || Number.isNaN(seconds) || seconds < 0) return '0m';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
}

export function handleApiMutationError(title: string, error: any) {
  notification.error({
    message: title,
    description:
      error?.response?.data?.error ??
      'Something went wrong, please see logs for more details',
    placement: 'bottomLeft',
  });
}
