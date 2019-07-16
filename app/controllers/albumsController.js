/* eslint-disable no-extra-parens */
/* eslint-disable new-cap */
const logger = require('../logger/index');
const { getUserByToken } = require('../helpers/user');

const {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds,
  registerPurchase,
  obtainOnePurchase,
  obtainAllPurchases
} = require('../services/albums');

const showAllAlbums = (req, res) => {
  getAllAlbums()
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There were errors getting all the albums ${JSON.stringify(error)}` })
    );
};

const showAlbumById = (req, res) => {
  getAlbumById(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(500)
        .send({ error: `There were errors getting the album ${req.params.id} ${JSON.stringify(error)}` })
    );
};

const showPhotosFromAlbum = (req, res) => {
  getPhotosFromAlbum(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({
        error: `There were errors getting all the photos from the Album ${req.params.id} ${JSON.stringify(
          error
        )}`
      })
    );
};

const showPhotoFromAlbumByIds = (req, res) => {
  const { idPhoto, idAlbum } = req.params;
  getPhotoFromAlbumByIds(idAlbum, idPhoto)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({
        error: `There were errors getting the photo ${idPhoto} from the Album ${idAlbum} ${JSON.stringify(
          error
        )}`
      })
    );
};

const buyAlbum = async (req, res) => {
  const { id } = req.params;

  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const user = await getUserByToken(token);

  const album = await getAlbumById(id);

  const userId = user.id;
  const externalReferenceId = album.body.id;
  const purchase = { userId, externalReferenceId };

  const previousPurchase = await obtainOnePurchase({ where: { userId, externalReferenceId } });

  if (previousPurchase) {
    logger.info('The album was already purchased.');
    return res.status(500).send('The album was already purchased.');
  }

  return registerPurchase(purchase)
    .then(result => {
      logger.info(
        // eslint-disable-next-line max-len
        `The user ${user.firstName} ${user.lastName} successfully purchased the album "${album.body.title}", id: ${id}, ${result}`
      );
      res.send(
        `The user ${user.firstName} ${user.lastName} successfully purchased the album "${album.body.title}", id: ${id}`
      );
    })
    .catch(error => {
      logger.error(`There were errors during the purchase of album "${album.body.title}", id: ${id}`);
      res.status(500).send({
        error: `There were errors during the purchase of album "${
          album.body.title
        }", id: ${id} : ${JSON.stringify(error)}`
      });
    });
};

const listAlbumsFromUser = async (req, res) => {
  const { user_id } = req.params;

  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const user = await getUserByToken(token);

  if (user.privilegeLevel === 'normal' && user.id !== parseInt(user_id)) {
    logger.info("This user cannot access these User's albums.");
    return res.status(400).send("This user cannot access these User's albums.");
  }

  const purchases = await obtainAllPurchases({ where: { userId: user_id } });
  const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);
  const albumsFromUser = await Promise.all(idsOfAlbums.map(result => getAlbumById(result)));
  const titlesFromAlbumsFromUser = albumsFromUser.map(result => result.body.title);

  if (!purchases) {
    logger.info('The albums could not be obtained');
    return res.status(400).send('The albums could not be obtained');
  }

  logger.info(`The user with the id: ${user_id} has the following albums: ${titlesFromAlbumsFromUser}`);
  return res
    .status(200)
    .send(`The user with the id: ${user_id} has the following albums: ${titlesFromAlbumsFromUser}`);
};

const listPhotosFromAlbum = async (req, res) => {
  const { album_id } = req.params;

  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const user = await getUserByToken(token);

  const purchases = await obtainAllPurchases({ where: { userId: user.id } });
  const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);

  if (!idsOfAlbums.includes(parseInt(album_id))) {
    logger.info(`The user with the id: ${user.id} has not bought the album ${album_id}.`);
    return res.status(400).send(`The user with the id: ${user.id} has not bought the album ${album_id}.`);
  }

  const photosFromAlbumObject = await getPhotosFromAlbum(album_id);

  if (!photosFromAlbumObject) {
    logger.info('The photos could not be obtained');
    return res.status(400).send('The photos could not be obtained');
  }

  const linksToPhotosFromAlbum = photosFromAlbumObject.body.map(photoObject => photoObject.url);

  logger.info(`The user with the id: ${user.id} has the following photos: ${linksToPhotosFromAlbum}`);
  return res
    .status(200)
    .send(`The user with the id: ${user.id} has the following photos: ${linksToPhotosFromAlbum}`);
};

module.exports = {
  showAllAlbums,
  showAlbumById,
  showPhotosFromAlbum,
  showPhotoFromAlbumByIds,
  buyAlbum,
  listAlbumsFromUser,
  listPhotosFromAlbum
};
