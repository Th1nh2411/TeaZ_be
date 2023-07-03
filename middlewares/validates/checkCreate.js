const checkCreateAccount = (Model) => {
  return async (req, res, next) => {
    try {
      const { phone } = req.body;
      const account = await Model.findOne({
        where: {
          phone,
        },
      });
      if (!account) {
        next();
      } else {
        res.status(409).json({ isExist: true, isSuccess: false });
      }
    } catch (error) {
      res.status(500).json({ isExist: false, isSuccess: false });
    }

  };
};



module.exports = {
  checkCreateAccount,

};
