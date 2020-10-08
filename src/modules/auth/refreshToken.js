const HttpError = require('http-errors');
const { where } = require('sequelize/types');
const otherHelper = require('../../helpers/otherhelpers');

function refreshTokenController(RefreshToken, User) {
  const getRefreshToken = async (refToken) => {
    try {
      const token = await RefreshToken.findOne({
        where: { refToken },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });
      const isExpired = Date.now() >= token.expires;
      if (!token || (token.revoked && isExpired)) {
        const err = new HttpError(401);
        return err;
      }
      return token;
    } catch (error) {
      return error;
    }
  };

  const refreshedTokens = async (res, req, next) => {
    try {
      const refToken = req.cookies.refreshToken;

      const oldToken = await getRefreshToken(refToken);
      const { user } = oldToken;
      // replace old refresh token with a new one and save
      const refreshToken = otherHelper.getRefreshToken(RefreshToken, user);
      // revoke token and save ole
      const revoked = true;
      const revokedAt = Date.now();
      await RefreshToken.update({
        revoked,
        revokedAt,
        replaceToken: refreshToken,
      },
      { where: { refToken } });
      // generate new jwt
      const jwtToken = otherHelper.generateJWT(otherHelper.toAuthJSON(user));
      // set cookie
      otherHelper.setTokenCookie(res, refreshToken);
      // return basic details and tokens
      return otherHelper.sendResponse(res, 200, true, null, null, null, jwtToken);
    } catch (error) {
      return next(error);
    }
  };

  const revokeToken = async (req, res, next) => {
    // accept token from request body or cookie
    const refToken = req.body.refreshToken || req.cookies.refreshToken;
    try {
      if (!refToken) otherHelper.sendResponse(res, 400, false, null, null, 'Token is required', null);
      await getRefreshToken(refToken);
      // revoke token and save
      const revoked = true;
      const revokedAt = Date.now();
      await RefreshToken.update({
        revoked,
        revokedAt,
      },
      { where: { refToken } });
      return otherHelper.sendResponse(res, 200, true, null, null, 'Token revoked', null);
    } catch (error) {
      return next(error);
    }
  };

  const getRefreshTokens = async (req, res, next) => {
    const { id } = req.payload.user;
    try {
      // check that user exists
      const user = await User.findOne({
        where: { id },
        attributes: [
          'id',
          'email',
        ],
      });

      // return refresh tokens for user
      const refreshTokens = await RefreshToken.findAll({ userId: user.id });
      return otherHelper.sendResponse(res, 200, true, refreshTokens, null, 'Tokens fetched successfully', null);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = refreshTokenController;
