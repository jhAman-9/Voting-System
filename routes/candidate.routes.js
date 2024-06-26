const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate.model.js");
const { jwtAuthMiddleware } = require("../jwt.js");
const User = require("../models/user.model.js");

// check that the person who is adding candidates is Admin or not
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.role === "admin") {
      return true;
    }
  } catch (error) {
    console.error("Error in checkAdminRole:", error);
    return false;
  }
};

// Post route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "user does not have admin role" });

    // if he is log in then he will able to see profile
    const candidateData = req.body;
    const newCandidate = new Candidate(candidateData);

    // console.log("New Candidate :" , newCandidate);

    const saveCondidate = await newCandidate.save();
    console.log(`Data Save`);
    res.status(200).json({ saveCondidate: saveCondidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List of Candidate
router.get("/", async (req, res) => {
  try {
    
    // Find all candidates and select only the name and party fields, excluding _id
    const candidate = await Candidate.find({}, "name party -_id");
    if (!candidate) return res.status(404).json("Not Candidate Found");
    return res.status(200).json(candidate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// change into candidate data is only done by admin
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    //  only admin can add candidates
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateID = req.params.candidateID;
    const updateCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updateCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    console.log("Candidate data is Updated");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Deletion of candidate only done by admin
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    //  only admin can add candidates
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    console.log("Candidate is Deleted Successfully");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// vote route
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  const candidateID = req.params.candidateID;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    const candidate = await Candidate.findById(candidateID);

    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    if (!user) return res.status(404).json({ message: "user not found" });

    if (user.isVoted)
      return res.status(400).json({ message: "User has already voted" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Admin is not allowed to Vote" });

    // update the Candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update the user documnet
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Candidate Voted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vote count
router.get("/vote/count", async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidate to only return their name and voteCount

    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Serer Error" });
  }
});

module.exports = router;
