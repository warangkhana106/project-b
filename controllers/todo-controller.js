const db = require('../models/db')
const {Status} = require('@prisma/client')

exports.getByUser = async (req, res, next) => {
  try {
    const todos = await db.todo.findMany({
      where : { userId : req.user.id}
    })
    res.json({todos})
  } catch (err) {
    next(err)
  }
}

exports.createTodo = async (req, res, next) => {
  // validate req.body
  const data = req.body
  try{
    const rs = await db.todo.create({
       data : { ...data, userId : req.user.id}
    })
    res.json({ msg: 'Create OK' , result : rs })
  }catch(err) {
    next(err)
  }
}

exports.updateTodo = async (req, res, next) => {
  // validate req.params + req.body
  const {id} = req.params
  const data = req.body
  try {
    const rs = await db.todo.update({
      data :  {...data},
      where: { id : +id , userId : req.user.id} 
    })
    res.json({msg: 'Update ok', result: rs})
  }catch(err){
    next(err)
  }
}

exports.deleteTodo = async (req, res, next) => {
  const {id} = req.params
  try {
    const rs = await db.todo.delete({ where : {id : +id, userId: req.user.id}})
    res.json({msg: 'Delete ok', result : rs})
  }catch(err) {
    next(err)
  }
}

exports.getAllStatus = async (req, res, next) => {
  res.json({status: Object.values(Status)})
}

exports.getmenutems = async (req, res, next) => {
  try {
    const games = await db.games.findMany({
      include:{
         gametype_name:true
      }
    });
    res.json(games);
  } catch (error) {
    next(error);
  }
};
exports.getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await db.games.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    next(error);
  }
};

exports.getType = async (req, res, next) => {
  try {
    const typegames = await db.typeGames.findMany();
    res.json(typegames);
  } catch (error) {
    next(error);
  }
};


// exports.getGameByType = async (req, res, next) => {
//   const { typeId } = req.query; // Get typeId from query parameters
//   try {
//     // Find products by typeId
//     const products = await games.find({ gametypeId: typeId }).populate('gametype_name');
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products by type:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


