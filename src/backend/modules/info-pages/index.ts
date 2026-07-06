/**
 * Info Pages Module Index
 * 
 * Exporta todos os componentes do módulo de páginas de informações.
 */

export { InfoPageRepository } from './repositories/info-page.repository';

export { InfoPageService } from './services/info-page.service';

export { InfoPageAPI } from './api/info-page.api';

export type {
  InfoPage,
  CreateInfoPageDto,
  UpdateInfoPageDto,
} from './dto/info-page.dto';
