// eslint-disable-next-line
interface String {
  trunc(n: number): string;
}

String.prototype.trunc = function (n: number): string {
  return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};
