import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly item_per_page: number;

  @ApiProperty()
  readonly total_items: number;

  @ApiProperty()
  readonly current_page: number;

  @ApiProperty()
  readonly total_pages: number;

  constructor(take: number, total: number, page: number) {
    this.item_per_page = take;
    this.total_items = total;
    this.current_page = page;
    this.total_pages = Math.max(
      Math.ceil(this.total_items / this.item_per_page),
    );
  }
}
