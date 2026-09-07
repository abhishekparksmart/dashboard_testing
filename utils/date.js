class DateUtils {
  static getCurrentDate(format = 'YYYY-MM-DD') {
    const date = new Date();
    // A simplified formatter for enterprise use
    const map = {
      YYYY: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      DD: String(date.getDate()).padStart(2, '0')
    };
    return format.replace(/YYYY|MM|DD/gi, matched => map[matched]);
  }

  static getPastDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this._formatDate(date);
  }

  static _formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

module.exports = { DateUtils };
