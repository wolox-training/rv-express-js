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

const listAlbumsFromUser = async (req, res) => {
  const { user_id } = req.params;

  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const newUser = await obtainOneUser({ where: { email: verifyToken(token).email } });
  const user = newUser.dataValues;

  if (user.privilegeLevel === 'normal' && user.id !== parseInt(user_id)) {
    logger.info("This user cannot access these User's albums.");
    return res.status(400).send("This user cannot access these User's albums.");
  }

  const purchases = await obtainAllPurchases({ where: { userId: user_id } });

  const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);

  Promise.all(idsOfAlbums.map(result => getAlbumById(result)))
    .then(result2 => result2.map(result3 => result3.body.title))
    .then(result4 => console.log(result4));

  // Promise.all(idsOfAlbums.map(result => getAlbumById(result))).then(res => {
  //   console.log(res);
  // });

  if (!purchases) {
    logger.info('The albums could not be obtained');
    return res.status(400).send('The albums could not be obtained');
  }

  logger.info(`The user with the id: ${user_id} has the following albums: ${idsOfAlbums}`);
  return res.status(400).send(`The user with the id: ${user_id} has the following albums: ${idsOfAlbums}`);
};

module.exports = {
  showAllAlbums,
  showAlbumById,
  showPhotosFromAlbum,
  showPhotoFromAlbumByIds,
  buyAlbum,
  listAlbumsFromUser
};
