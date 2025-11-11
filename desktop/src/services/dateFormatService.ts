export const dateFormatService = {
  /**
   * Format tournament status date (e.g., "UPCOMING · 77 MINUTES AGO, 21:00 UTC+2")
   * @param dateString - The date string to format
   * @returns Formatted status string
   */
  formatTournamentStatus: (dateString: string, publishedDate?: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate time elapsed since publication (or use start_date if no publishedDate)
    const publishedAt = publishedDate ? new Date(publishedDate) : date;
    const diffMs = now.getTime() - publishedAt.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMins = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    const timezoneStr = `UTC${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins.toString().padStart(2, '0')}` : ''}`;

    // Always show time elapsed since publication (prioritize days/weeks/months over hours/minutes)
    if (diffMonths > 0) {
      return `UPCOMING · ${diffMonths} ${diffMonths === 1 ? 'MONTH' : 'MONTHS'} AGO, ${time} ${timezoneStr}`;
    } else if (diffWeeks > 0) {
      return `UPCOMING · ${diffWeeks} ${diffWeeks === 1 ? 'WEEK' : 'WEEKS'} AGO, ${time} ${timezoneStr}`;
    } else if (diffDays > 0) {
      return `UPCOMING · ${diffDays} ${diffDays === 1 ? 'DAY' : 'DAYS'} AGO, ${time} ${timezoneStr}`;
    } else if (diffHours > 0) {
      return `UPCOMING · ${diffHours} ${diffHours === 1 ? 'HOUR' : 'HOURS'} AGO, ${time} ${timezoneStr}`;
    } else {
      // If less than an hour, show as "JUST NOW" or "RECENTLY"
      return `UPCOMING · RECENTLY, ${time} ${timezoneStr}`;
    }
  },

  /**
   * Format date and time (e.g., "June 11, 19:55 UTC+2")
   * @param dateString - The date string to format
   * @returns Formatted date string
   */
  formatDateTime: (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMins = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    const timezoneStr = `UTC${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins.toString().padStart(2, '0')}` : ''}`;
    return `${month} ${day}, ${time} ${timezoneStr}`;
  },

  /**
   * Format check-in range (e.g., "June 11, 19:55 – 20:45 UTC+2")
   * @param checkInStart - The check-in start date string
   * @param checkInEnd - Optional check-in end date string
   * @returns Formatted check-in range string
   */
  formatCheckInRange: (checkInStart: string, checkInEnd?: string): string => {
    const startDate = new Date(checkInStart);
    const month = startDate.toLocaleDateString('en-US', { month: 'long' });
    const day = startDate.getDate();
    const startTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const offset = startDate.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMins = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    const timezoneStr = `UTC${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins.toString().padStart(2, '0')}` : ''}`;

    if (checkInEnd) {
      const endDate = new Date(checkInEnd);
      const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${month} ${day}, ${startTime} – ${endTime} ${timezoneStr}`;
    }
    
    return `${month} ${day}, ${startTime} ${timezoneStr}`;
  },
};

