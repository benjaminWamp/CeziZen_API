const titlesAndDescriptions = [
  {
    title: 'Challenge Puzzle : Un grand puzzle en famille',
    description:
      'Assemblez un puzzle géant avec vos proches ! Plusieurs étapes à franchir : commencer par les bords, trier les pièces par couleur, et résoudre en équipe.',
  },
  {
    title: 'Mission DIY : Créez votre propre décoration de fête',
    description:
      'Relevez le défi de créer ensemble des décorations maison pour une fête ou une occasion spéciale. Découpez, collez, personnalisez vos créations !',
  },
  {
    title: 'Défi Nature : Organisez une chasse au trésor en plein air',
    description:
      'Transformez votre jardin ou votre quartier en terrain de chasse au trésor. Cachez des indices et résolvez des énigmes en famille ou entre amis !',
  },
  {
    title: 'Challenge Dessin : Créez un dessin à plusieurs mains',
    description:
      'Réunissez-vous pour créer une œuvre d’art collective. Un dessin à plusieurs mains, chaque personne dessine une partie et l’autre doit compléter !',
  },
  {
    title: 'Mission Escape Game Maison : Créez un jeu de piste',
    description:
      'Transformez une pièce de la maison en escape game : cachés des indices, proposez des défis à résoudre en équipe, et finissez par un trésor caché !',
  },
  {
    title: 'Challenge Musique : Créez une chanson en famille',
    description:
      'Composez ensemble une chanson sur un thème donné ! Chacun peut participer à l’écriture, à la mélodie ou aux percussions maison.',
  },
  {
    title: 'Jeu de Construction : Build un château de cartes géant',
    description:
      'Rassemblez des cartes ou d’autres matériaux et tentez de construire un château géant avec les membres de votre famille ou vos amis. Qui va réussir à faire la plus haute tour ?',
  },
  {
    title: 'Défi Lecture : Un livre à finir à 4 mains',
    description:
      'Lisez un livre ensemble, puis discutez des personnages, de l’intrigue, des leçons à tirer de l’histoire. Une lecture partagée, ça se vit aussi en équipe !',
  },
  {
    title: 'Challenge Vidéo : Créez un court-métrage à plusieurs',
    description:
      'Réunissez votre équipe et réalisez un court-métrage. De l’écriture du scénario au montage, chacun joue un rôle pour faire vivre le projet !',
  },
  {
    title: 'Mission Cuisine : Préparez un dîner complet',
    description:
      'Mettez-vous en équipe pour préparer un repas complet. Entrée, plat, dessert. L’un cuisine, l’autre dresse, l’autre fait la vaisselle !',
  },
  {
    title: 'Challenge Sport : Créez une olympiade à la maison',
    description:
      'Définissez plusieurs épreuves physiques et testez votre esprit d’équipe. Qui remportera la médaille d’or à la maison ?',
  },
  {
    title: 'Défi Photo : Créez un album photo avec des thèmes',
    description:
      'Photographiez des moments spécifiques : "Un sourire", "Un instant magique", "Un objet du quotidien". Créez un album photo de famille !',
  },
  {
    title: 'Mission DIY : Créez un objet utile à la maison',
    description:
      'Avec des matériaux simples, fabriquez un objet utile pour votre maison : une étagère, un porte-manteau, ou un rangement. À faire ensemble, étape par étape !',
  },
];

export function generateRessourcesSeed(
  categoryIds: string[],
  typeRessourceId: string,
) {
  if (categoryIds.length === 0) {
    throw new Error('Le tableau de categoryIds ne peut pas être vide.');
  }
  if (!typeRessourceId) {
    throw new Error('Le resourceId ne peut pas être vide.');
  }

  const fixedRessources = [
    {
      title: 'Défi En Famille : Créez votre propre escape game !',
      description:
        'Transformez votre salon en salle d’escape game avec des énigmes à résoudre en équipe. Créez des étapes, des indices et des mystères !',
      maxParticipant: 50,
      nbParticipant: 10,
      deadLine: new Date('2025-06-01'),
      categoryId: categoryIds[0 % categoryIds.length],
      typeRessourceId: typeRessourceId,
      isValidate: true,
      status: 'En cours',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Challenge Cuisine en Duo : Recette à 4 mains',
      description:
        'Réunissez-vous en binôme et réalisez une recette surprise ensemble ! De la préparation à la présentation, chaque étape doit être une vraie équipe.',
      maxParticipant: 30,
      nbParticipant: 25,
      deadLine: new Date('2025-08-15'),
      categoryId: categoryIds[1 % categoryIds.length],
      typeRessourceId: typeRessourceId,
      isValidate: true,
      status: 'Validé',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Défi Maison : Créez un parcours sportif à l’intérieur',
      description:
        'Transformez votre maison en terrain de jeu ! Créez des étapes d’un parcours sportif à réaliser seul ou en famille. Chronométrez-vous et échangez vos résultats.',
      maxParticipant: 20,
      nbParticipant: 18,
      deadLine: new Date('2025-03-10'),
      categoryId: categoryIds[2 % categoryIds.length],
      typeRessourceId: typeRessourceId,
      isValidate: true,
      status: 'Expiré',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Défi Arts & Créations : Créez une œuvre en famille',
      description:
        'Lancez-vous dans un projet créatif avec vos proches : peinture, sculpture, collage, ou même création de costumes ! L’objectif : faire équipe et créer ensemble.',
      maxParticipant: 20,
      nbParticipant: 18,
      deadLine: new Date('2025-03-10'),
      categoryId: categoryIds[2 % categoryIds.length],
      typeRessourceId: typeRessourceId,
      isValidate: false,
      status: 'En attente',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Défi Jardinage : Créez un mini potager à la maison | DEMO !',
      description:
        'Plantez des herbes ou des légumes dans des pots et suivez ensemble les étapes de croissance. Un projet de jardinage à réaliser en famille ou avec des amis !',
      maxParticipant: 50,
      nbParticipant: 7,
      deadLine: new Date('2028-03-10'),
      categoryId: categoryIds[2 % categoryIds.length],
      typeRessourceId: typeRessourceId,
      isValidate: true,
      status: 'En cours',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const autoGeneratedResources = titlesAndDescriptions.map((entry, i) => ({
    title: entry.title,
    description: entry.description,
    maxParticipant: Math.floor(Math.random() * 5) + 3,
    nbParticipant: Math.floor(Math.random() * 3),
    deadLine: new Date(`2025-12-${(i % 28) + 1}`),
    categoryId: categoryIds[i % categoryIds.length],
    typeRessourceId: typeRessourceId,
    isValidate: true,
    status: i % 3 === 0 ? 'Validé' : 'En cours',
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return [...fixedRessources, ...autoGeneratedResources];
}
