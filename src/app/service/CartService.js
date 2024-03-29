import httpStatus from 'http-status-codes';
import { Op, literal } from 'sequelize';

import Cart from '../models/Cart';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async createCart(req, res) {
    let result = {};
    let cartBody = req;

    const chassisExist = await Cart.findOne({
      where: { cart_chassis: cartBody.cart_chassis },
    });
    const boardExist = await Cart.findOne({
      where: { cart_board: cartBody.cart_board },
    });

    if (chassisExist) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        msg: 'This chassis cart already exists.',
      };
      return result;
    }

    if (boardExist) {
      result = {
        httpStatus: httpStatus.CONFLICT,
        msg: 'This board cart already exists.',
      };
      return result;
    }

    await Cart.create(cartBody);

    result = { httpStatus: httpStatus.CREATED, status: 'successful' };
    return result;
  },

  async getAllSelect(req, res) {
    let result = {};
    const select = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: literal(`(SELECT "cart_id" FROM "financial_statements")`),
        },
      },
      attributes: ['id', 'cart_models'],
    });

    const selectFinancial = await Cart.findAll({
      attributes: ['id', 'cart_models'],
      include: [
        {
          model: FinancialStatements,
          as: 'financialStatements',
          required: true,
          where: {
            status: false,
          },
          attributes: ['id', 'cart_id', 'cart_models'],
        },
      ],
    });

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: [...select.concat(...selectFinancial)],
    };

    return result;
  },

  async getAllCart(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
      cart_models,
      id,
      search,
    } = req.query;

    const where = {};
    // if (id) where.id = id;

    const total = (await Cart.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const carts = await Cart.findAll({
      where: search
        ? {
            [Op.or]: [
              // { id: search },
              { cart_color: { [Op.iLike]: `%${search}%` } },
              { cart_models: { [Op.iLike]: `%${search}%` } },
              { cart_year: { [Op.iLike]: `%${search}%` } },
              { cart_brand: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : where,
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    const currentPage = Number(page);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: carts,
    };

    return result;
  },

  async getIdCart(req, res) {
    let result = {};

    let cart = await Cart.findByPk(req.id, {
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    if (!cart) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Cart not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: cart,
    };
    return result;
  },

  async updateCart(req, res) {
    let result = {};

    let carts = req;
    let cartId = res.id;

    const cart = await Cart.findByPk(cartId);

    await cart.update(carts);

    const cartResult = await Cart.findByPk(cartId, {
      attributes: [
        'id',
        'cart_models',
        'cart_brand',
        'cart_tara',
        'cart_color',
        'cart_bodyworks',
        'cart_year',
        'cart_chassis',
        'cart_liter_capacity',
        'cart_ton_capacity',
        'cart_board',
      ],
    });

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: cartResult,
    };
    return result;
  },

  async deleteCart(req, res) {
    let result = {};

    const id = req.id;

    const cart = await Cart.destroy({
      where: {
        id: id,
      },
    });

    if (!cart) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Cart not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      responseData: { msg: 'Deleted cart' },
    };
    return result;
  },
};
