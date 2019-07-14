/* eslint-disable no-extra-parens */
/* eslint-disable new-cap */
const logger = require('../logger/index');
const { obtainOneUser } = require('../services/users');
const { verifyToken } = require('../helpers/token');

const {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds,
  registerPurchase,
  obtainOnePurchase
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

  const newUser = await obtainOneUser({ where: { email: verifyToken(token).email } });
  const user = newUser.dataValues;

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

module.exports = { showAllAlbums, showAlbumById, showPhotosFromAlbum, showPhotoFromAlbumByIds, buyAlbum };
