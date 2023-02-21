interface String {
  format(...replacements: string[]): string;
  trunc(n: number): string;
}

String.prototype.format = function (...args): string {
  return this.replace(/{(\d+)}/g, function (match: any, number: number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

String.prototype.trunc = function (n: number): string {
  return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};
