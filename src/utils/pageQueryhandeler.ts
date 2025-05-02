import { BadRequestException } from '@nestjs/common';

//Définition de la fonction =>
/**
 * Fonction utilitaire pour valider et convertir les paramètres de pagination (page et perPage).
 * @param page - Numéro de la page (peut être une chaîne de caractères).
 * @param perPage - Taille de la page (peut être une chaîne de caractères).
 * @returns Un objet contenant `page` et `perPage` convertis en nombres.
 * @throws BadRequestException si les paramètres sont invalides.
 */
export function validatePagination(
  page: string,
  perPage: string,
): {
  page: number;
  perPage: number;
} {
  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(perPage, 10);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    throw new BadRequestException(
      'Le paramètre "page" doit être un nombre positif.',
    );
  }
  if (isNaN(perPageNumber) || perPageNumber <= 0) {
    throw new BadRequestException(
      'Le paramètre "perPage" doit être un nombre positif.',
    );
  }

  return { page: pageNumber, perPage: perPageNumber };
}
