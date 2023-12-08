import Joi from 'joi'

export const patchUserSchema = Joi.object({
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string(),
    profile_picture: Joi.string(),
})

export const idShema = Joi.object({
    id: Joi.number().required(),
})