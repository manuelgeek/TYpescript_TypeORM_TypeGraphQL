import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import PageEntity from '../entities/PageEntity';

import PortfolioEntity from '../entities/PortfolioEntity';
import PortfolioVersionEntity, { PortfolioVersion } from '../entities/PortfolioVersionEntity';

@Resolver()
@Service()
export default class CreatePortfoliosResolver {
  @Query(() => PortfolioEntity, { description: 'Create a portfolio entry' })
  async createPortfolio(
    @Arg('name') name: string,
    @Arg('url') url: string,
    @Arg('pages', (type) => [PageEntity]) pages: PageEntity[]
  ): Promise<PortfolioEntity | undefined> {
    const portfolioRepository = getRepository(PortfolioEntity);

    const query = portfolioRepository.create({ name, url });
    const portfolio = await portfolioRepository.save(query);

    const versionRepository = getRepository(PortfolioVersionEntity);
    const v = versionRepository.create({ version: PortfolioVersion.Draft, portfolio });
    const versionEntity = await versionRepository.save(v);

    pages.forEach(async ({ name, url }) => {
      const pageRepository = getRepository(PageEntity);
      const p = pageRepository.create({ name, url, portfolio, version: versionEntity });
      await pageRepository.save(p);
    });

    return portfolioRepository.findOne({
      relations: ['pages', 'versions', 'pages.version'],
      where: { id: portfolio.id },
    });
  }
}
