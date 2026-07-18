import { LaudusClientService } from '../services/laudus-client.service';
import { PagedRequestDto } from '../dto/paged-request.dto';
import { PagedResponseDto } from '../dto/paged-response.dto';

export abstract class BaseRepository<TEntity> {
  constructor(
    protected readonly client: LaudusClientService,
    protected readonly endpoint: string,
  ) {}

  // POST /{endpoint}/list
  public async list(
    request: PagedRequestDto,
  ): Promise<PagedResponseDto<TEntity>> {
    return this.client.post<PagedResponseDto<TEntity>>(
      `${this.endpoint}/list`,
      request,
    );
  }

  // GET /{endpoint}/{id}
  public async findById(id: number | string): Promise<TEntity> {
    return this.client.get<TEntity>(`${this.endpoint}/${id}`);
  }

  // POST /{endpoint}
  public async create<TDto>(dto: TDto): Promise<TEntity> {
    return this.client.post<TEntity>(this.endpoint, dto);
  }

  // PUT /{endpoint}/{id}
  public async update<TDto>(
    id: number | string,
    dto: TDto,
  ): Promise<TEntity> {
    return this.client.put<TEntity>(`${this.endpoint}/${id}`, dto);
  }

  // DELETE /{endpoint}/{id}
  public async remove(id: number | string): Promise<void> {
    await this.client.delete<void>(`${this.endpoint}/${id}`);
  }
}