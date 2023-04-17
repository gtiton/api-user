import Credit from '../models/Credit';
import FinancialStatements from '../models/FinancialStatements';
import Driver from '../models/Driver';

export default {
  async create(body) {
    const financialProps = await FinancialStatements.findOne({
      where: { id: body.financial_id },
    });
    if (!financialProps) throw Error('Financial not found.');

    const result = await Credit.create({
      driver_id: financialProps.driver_id,
      financial_statements_id: body.financial_id,
      value: body.value,
      description: body.description,
    });

    const driverFind = await Driver.findByPk(result.driver_id);
    driverFind.addTransaction({
      value: result.value,
      typeTransactions: result.description,
    });

    const driver = await Driver.findByPk(driverFind.id);
    const values = driverFind.transactions.map((res) => res.value);
    const total = values.reduce((acc, cur) => acc + cur, 0);

    const resultF = await driver.update({
      transactions: driverFind.transactions,
      credit: total,
    });

    return resultF;
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const total = (await Credit.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const credits = await Credit.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      dataResult: credits,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    let credit = await Credit.findByPk(id);

    if (!credit) throw Error('Credit not found');

    return {
      dataResult: credit,
    };
  },

  async delete(id) {
    const credit = await Credit.destroy({
      where: {
        id: id,
      },
    });

    if (!credit) throw Error('Credit not found');

    return {
      msg: 'Deleted credit',
    };
  },
};
