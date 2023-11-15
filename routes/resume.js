import express from "express";
import {
  createResumeInfo,
  getResumeByUserAndResumeId,
  updateResumeByUserAndResumeId,
} from "../controllers/resumeInfo.js";
import { createResumesummary } from "../controllers/summary.js";
import {
  createExprience,
  getExperienceByUserAndExperienceId,
  updateExprienceByUserAndExprienceId,
} from "../controllers/resumeExp.js";
import {
  createEducation,
  getEducationByUserAndEducationId,
  updateEducationByUserAndEducationId,
} from "../controllers/resumeEdu.js";
import {
  createSkill,
  getSkillByUserAndSkillId,
  updateSkillByUserAndSkillId,
} from "../controllers/resumeSkills.js";
import {
  createLanguage,
  getlanguageByUserAndlanguageId,
  updatelanguageByUserAndlanguageId,
} from "../controllers/resumeLan.js";
import {
  createReference,
  getReferenceByUserAndReferenceId,
  updateReferenceByUserAndReferenceId,
} from "../controllers/resumeRef.js";
import {
  createProject,
  getProjectByUserAndProjectId,
  updateProjectByUserAndProjectId,
} from "../controllers/resumeProject.js";
import {
  createPublication,
  getPublicationByUserAndPublicationId,
  updatePublicationByUserAndPublicationId,
} from "../controllers/resumePub.js";
import {
  createAward,
  getAwardByUserAndAwardId,
  updateAwardByUserAndAwardId,
} from "../controllers/resumeAward.js";
import {
  createCertification,
  getCertificationByUserAndCertificationId,
  updateCertificationByUserAndCertificationId,
} from "../controllers/resumeCert.js";

const router = express.Router();

// CREATE A USER
router.post("/info/:userId", createResumeInfo);
router.post("/exprience/:userId/:resumeId", createExprience);
router.post("/education/:userId/:resumeId", createEducation);
router.post("/skill/:userId/:resumeId", createSkill);
router.post("/language/:userId/:resumeId", createLanguage);
router.post("/reference/:userId/:resumeId", createReference);
router.post("/project/:userId/:resumeId", createProject);
router.post("/publication/:userId/:resumeId", createPublication);
router.post("/award/:userId/:resumeId", createAward);
router.post("/certification/:userId/:resumeId", createCertification);
router.post("/summary/:userId", createResumesummary);
router.put(
  "/exprience/:userId/:exprienceId",
  updateExprienceByUserAndExprienceId
);
router.put(
  "/education/:userId/:educationId",
  updateEducationByUserAndEducationId
);
router.put("/skill/:userId/:skillId", updateSkillByUserAndSkillId);
router.put("/language/:userId/:languageId", updatelanguageByUserAndlanguageId);
router.put(
  "/reference/:userId/:referenceId",
  updateReferenceByUserAndReferenceId
);
router.put("/project/:userId/:projectId", updateProjectByUserAndProjectId);
router.put(
  "/publication/:userId/:publicationId",
  updatePublicationByUserAndPublicationId
);
router.put("/award/:userId/:awardId", updateAwardByUserAndAwardId);
router.put(
  "/certification/:userId/:certificationId",
  updateCertificationByUserAndCertificationId
);
router.put("/info/:userId/:resumeId", updateResumeByUserAndResumeId);
router.get("/info/get/:userId/:resumeId/", getResumeByUserAndResumeId);
router.get(
  "/exprience/get/:userId/:resumeId/:experienceId",
  getExperienceByUserAndExperienceId
);
router.get(
  "/education/get/:userId/:resumeId/:educationId",
  getEducationByUserAndEducationId
);
router.get("/skill/get/:userId/:resumeId/:skillId", getSkillByUserAndSkillId);
router.get(
  "/language/get/:userId/:resumeId/:languageId",
  getlanguageByUserAndlanguageId
);
router.get(
  "/reference/get/:userId/:resumeId/:referenceId",
  getReferenceByUserAndReferenceId
);
router.get(
  "/project/get/:userId/:resumeId/:projectId",
  getProjectByUserAndProjectId
);
router.get(
  "/publication/get/:userId/:resumeId/:publicationId",
  getPublicationByUserAndPublicationId
);
router.get("/award/get/:userId/:resumeId/:awardId", getAwardByUserAndAwardId);
router.get(
  "/certification/get/:userId/:resumeId/:certificationId",
  getCertificationByUserAndCertificationId
);
export default router;
