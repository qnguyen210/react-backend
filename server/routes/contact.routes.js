import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js"; // ⬅ add this

const router = express.Router();

// /api/contacts  (because in server.js you do app.use("/api", contactRoutes))
router
  .route("/contacts")
  .get(authCtrl.requireSignin, contactCtrl.list)
  .post(authCtrl.requireSignin, contactCtrl.create)
  .delete(authCtrl.requireSignin, contactCtrl.removeAll);

router
  .route("/contacts/:contactId")
  .get(authCtrl.requireSignin, contactCtrl.read)
  .put(authCtrl.requireSignin, contactCtrl.update)
  .delete(authCtrl.requireSignin, contactCtrl.remove);

router.param("contactId", contactCtrl.contactByID);

export default router;
