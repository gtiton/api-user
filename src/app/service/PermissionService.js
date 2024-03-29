import httpStatus from 'http-status-codes';
import Permission from "../models/Permission";

export default {
  async createPermission(req, res) {
    let result = {}
    let permission = req
    
    const permissionExist = await Permission.findOne({ where: { role: permission.role } });

    if (permissionExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This permission role already exists.' };
      return result;
    }

    const resultPermission = await Permission.create(permission);

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: resultPermission }      
    return result
  },
  
  async updatePermission(req, res) {
    let result = {}
    
    const permission = await Permission.findByPk(res.id);

    if (!permission) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This permission role already exists.' };
      return result;
    }

    const resultPermission = await permission.update(req);

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: resultPermission }      
    return result
  },

  async getAllPermission() {
    let result = {}

    const permissao = await Permission.findAll({
      attributes: ["id", "role", "actions"]
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: permissao } 
    
    return result
  },
}