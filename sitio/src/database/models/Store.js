module.exports = (sequelize, dataTypes) => {
    let alias = "Stores";
    let cols = {
        id:{
            type: dataTypes.INTEGER(11),
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        nombre: {
            type:dataTypes.STRING(45),
            allowNull:false
        },
        imagen:{
            type:dataTypes.STRING(45)
        },
        id_usuario:{
            type:dataTypes.INTEGER(11),
            allowNull:false
        }
    }

    let config = {
        tableName  : "stores",
        timestamps: false
    }
    const Store = sequelize.define(alias,cols,config)

    return Store;
}