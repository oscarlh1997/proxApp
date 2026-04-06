export class EMA {
  private y: number | null = null;
  constructor(private alpha: number) {}
  update(x: number): number {
    if (this.y === null) {
      this.y = x;
      return x;
    }
    this.y = this.alpha * x + (1 - this.alpha) * this.y;
    return this.y;
  }
}
