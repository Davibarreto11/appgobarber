import { container } from 'tsyringe'

import type IStorageProvider from './StorageProvider/models/IStorageProvider'
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider'

import type IMailProvider from './MailProvider/models/IMailProvider'
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider'

import type IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

import type ICacheProvider from './CacheProvider/models/ICacheProvider'
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider'

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
)

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider)
)

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider
)
