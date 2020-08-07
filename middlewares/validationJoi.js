const { celebrate, Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);
const BadRequest = require("../errors/badRequest");
const {
  enterEmail,
  incorrectName,
  invalidLink,
  enterPass,
  notHex,
  enterKeyword,
  enterTitle,
  enterText,
  enterDate,
  enterSource,
} = require("../constants/errorText");

module.exports.signupCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().error(new BadRequest(enterEmail)),
    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .error(new BadRequest(enterPass)),
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .error(new BadRequest(incorrectName)),
  }),
});

module.exports.signinCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().error(new BadRequest(enterEmail)),
    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .error(new BadRequest(enterPass)),
  }),
});

module.exports.createArticleCheck = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().error(new BadRequest(enterKeyword)),
    title: Joi.string().required().error(new BadRequest(enterTitle)),
    text: Joi.string().required().error(new BadRequest(enterText)),
    date: Joi.string().required().error(new BadRequest(enterDate)),
    source: Joi.string().required().error(new BadRequest(enterSource)),
    link: Joi.string()
      .required()
      .regex(
        /^(?:https?:\/\/)(?:www\.)?((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[^._www-][a-zA-Z0-9.-]+[.][a-zA-Z]{2,}|[^._www-][a-zA-Z0-9.-]*[.][a-zA-Z]{2,})(:[1-9][0-9]{1,4})?(?:\/(?!\/)[\w\d?~-]*)*#?/,
      )
      .error(new BadRequest(invalidLink)),
    image: Joi.string()
      .required()
      .regex(
        /^(?:https?:\/\/)(?:www\.)?((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[^._www-][a-zA-Z0-9.-]+[.][a-zA-Z]{2,}|[^._www-][a-zA-Z0-9.-]*[.][a-zA-Z]{2,})(:[1-9][0-9]{1,4})?(?:\/(?!\/)[\w\d?~-]*)*#?/,
      )
      .error(new BadRequest(invalidLink)),
  }),
});

module.exports.deleteArticleByIdChech = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId().error(new Error(notHex)),
  }),
});
