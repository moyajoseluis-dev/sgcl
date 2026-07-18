import { LaudusClientService } from '../services/laudus-client.service';

export abstract class BaseRepository<TEntity> {
  constructor(
    protected readonly client: LaudusClientService,
    protected readonly endpoint: string,
  ) {}

  // Aceptamos cualquier objeto que tenga la estructura básica de Laudus
  public async list(request: Record<string, unknown>): Promise<unknown> {
    return this.client.post(`${this.endpoint}/list`, request);
  }

  public async findById(id: number | string): Promise<TEntity> {
    return this.client.get<TEntity>(`${this.endpoint}/${id}`);
  }

  public async create<TDto>(dto: TDto): Promise<TEntity> {
    return this.client.post<TEntity>(this.endpoint, dto);
  }

  public async update<TDto>(id: number | string, dto: TDto): Promise<TEntity> {
    return this.client.put<TEntity>(`${this.endpoint}/${id}`, dto);
  }

  public async remove(id: number | string): Promise<void> {
    await this.client.delete<void>(`${this.endpoint}/${id}`);
  }
}