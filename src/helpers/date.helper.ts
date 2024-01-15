export class DateHelper {
  public static formatDate(date: Date): string {
    const str = date.toISOString();

    const strDate = str.split("T");
    return strDate[0];
  }
}
