import { Test, TestingModule } from '@nestjs/testing';
import { ArticleImageService } from './article-image.service';
import { PrismaService } from 'src/prisma.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

describe('ArticleImageService', () => {
  let service: ArticleImageService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      articleImage: {
        create: jest.fn(),
      },
      article: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleImageService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ArticleImageService);
  });

  describe('create', () => {
    it('devrait créer une image sans erreur', async () => {
      const dto = { path: 'foo.png', articleIds: [1, 2] };
      (prisma.articleImage.create as jest.Mock).mockResolvedValue({ id: 42, path: 'foo.png' });

      const result = await service.create(dto as any);

      expect(prisma.articleImage.create).toHaveBeenCalledWith({
        data: {
          path: dto.path,
          articles: { connect: [{ id: 1 }, { id: 2 }] },
        },
      });
      expect(result).toEqual({ id: 42, path: 'foo.png' });
    });

    it('devrait lever InternalServerErrorException en cas d’erreur', async () => {
      (prisma.articleImage.create as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.create({ path: 'x' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateArticleImage', () => {
    const articleId = 7;
    const existingImages = [{ id: 1, path: '/uploads/article-images/article-1746797442127.png' }];
    const newPath = 'bar.png';

    beforeEach(() => {
      // mock fs.existsSync and fs.unlinkSync
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    it('devrait supprimer les anciennes images, en créer une nouvelle et mettre à jour l’article', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue({ articleImages: existingImages });
      (prisma.articleImage.create as jest.Mock).mockResolvedValue({ id: 2, path: newPath });
      const updated = { id: articleId, articleImages: [{ id: 2, path: newPath }], category: { id: 3, label: 'C' } };
      (prisma.article.update as jest.Mock).mockResolvedValue(updated);

      const res = await service.updateArticleImage(articleId, newPath);

      // on supprime le fichier existant
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('a.png'));
      expect(fs.unlinkSync).toHaveBeenCalled();

      // on supprime l'enregistrement dans la base
      expect(prisma.articleImage.delete).toHaveBeenCalledWith({ where: { id: 1 } });

      // on crée la nouvelle image
      expect(prisma.articleImage.create).toHaveBeenCalledWith({ data: { path: newPath } });

      // on met à jour l’article
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: articleId },
        data: { articleImages: { set: [{ id: 2 }] } },
        include: { articleImages: true, category: { select: { label: true, id: true } } },
      });

      expect(res).toEqual({
        message: 'Image de l’article mise à jour avec succès',
        data: updated,
      });
    });
  });

  describe('removeImage', () => {
    const articleId = 9;
    const imageId = 5;
    const pathStr = `/uploads/article-images/img.png`;

    beforeEach(() => {
      jest.spyOn(fs.promises, 'unlink').mockResolvedValue(undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('devrait déconnecter et supprimer l’image', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue({
        articleImages: [{ id: imageId, path: pathStr }],
      });
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      const res = await service.removeImage(articleId, imageId);

      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: articleId },
        include: { articleImages: { where: { id: imageId } } },
      });
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: articleId },
        data: { articleImages: { disconnect: { id: imageId } } },
      });

      // on supprime le fichier
      const filename = pathStr.split('/').pop();
      const filePath = join(process.cwd(), 'uploads', 'article-images', filename!);
      expect(fs.promises.unlink).toHaveBeenCalledWith(filePath);

      expect(prisma.articleImage.delete).toHaveBeenCalledWith({ where: { id: imageId } });
      expect(res).toEqual({ message: `Image ${imageId} supprimée de l'article ${articleId}` });
    });

    it('devrait lever NotFoundException si article introuvable', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.removeImage(articleId, imageId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lever NotFoundException si l’image n’est pas liée', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue({ articleImages: [] });
      await expect(service.removeImage(articleId, imageId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ignore ENOENT et ré-throw sinon', async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue({
        articleImages: [{ id: imageId, path: pathStr }],
      });
      jest.spyOn(fs.promises, 'unlink').mockRejectedValue(Object.assign(new Error('oops'), { code: 'OTHER' }));
      await expect(service.removeImage(articleId, imageId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
