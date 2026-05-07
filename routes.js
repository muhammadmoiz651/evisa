const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

const frontendPath = path.join(__dirname, 'Frontend');

const adminPath = path.join(__dirname, 'Admin');




// Define routes for Admin Panel
router.get('/admin', (req, res) => res.sendFile(path.join(adminPath, 'index.js')));

router.get('/userr', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'user.html')));
router.get('/advisor', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'advisor.html')));


router.get('/check', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'new.html')));

// Define routes
router.get('/home', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'home.html')));
router.get('/universityexplorer', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'university.html')));
router.get('/scholarshipfinder', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorship.html')));
router.get('/stanforduniversity', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Universitydetail.html')));
router.get('/visa', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Visa.html')));
router.get('/testprepration', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'TestPrepration.html')));
router.get('/signin', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Signin.html')));
router.get('/registration', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Registration.html')));
router.get('/mocktest', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'MockTest.html')));
router.get('/ielts', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Ielts.html')));
router.get('/forget', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'forget.html')));
router.get('/europasscv', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'EuropassCv.html')));
router.get('/eligibilitychecker', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'EligibilityChecker.html')));
router.get('/accommodationfinder', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'AccommodationFinder.html')));

// scholarship pages
router.get('/idex', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipidex.html')));
router.get('/eiffel', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipeiffel.html')));
router.get('/eiffels', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipeiffels.html')));
router.get('/tum', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshiptum.html')));
router.get('/ub', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipubs.html')));
router.get('/arts', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipartsspain.html')));
router.get('/upf', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipupf.html')));
router.get('/iss', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipiss.html')));
router.get('/uga', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipuga.html')));
router.get('/uam', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipuam.html')));
router.get('/upc', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipupc.html')));
router.get('/deut', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipdeut.html')));
router.get('/schdeuts', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipdeuts.html')));
router.get('/daad', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipdaad.html')));
router.get('/kaad', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipkaad.html')));
router.get('/schmbs', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipmbs.html')));
router.get('/muascholorship', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'Scholorshipmua.html')));



// accommodation pages
router.get('/accommodationdetails', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation1.html')));
router.get('/accommodationdetails1', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation2.html')));
router.get('/accommodationdetails2', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation4.html')));
router.get('/accommodationdetails3', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation5.html')));
router.get('/accommodationdetails4', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation6.html')));
router.get('/accommodationdetails5', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation7.html')));
router.get('/accommodationdetails6', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation8.html')));
router.get('/accommodationdetails7', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation9.html')));
router.get('/accommodationdetails8', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'accommodation10.html')));

//Visa pages
router.get('/francevisa', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'VisaFrance.html')));
router.get('/spainvisa', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'VisaSpain.html')));
router.get('/germanyvisa', (req, res) => res.sendFile(path.join(__dirname, "Frontend", 'VisaGermany.html')));



// Define routes for each university detail page
router.get('/university/paris-saclay', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail1.html'));
});
router.get('/university/pantheon-sorbonne', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail2.html'));
});
router.get('/university/technicaluniversity', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail3.html'));
});
router.get('/university/ludwig', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail4.html'));
});
router.get('/university/barcelona', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail5.html'));
});
router.get('/university/pompeu', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail6.html'));
});
router.get('/university/ecol', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail7.html'));
});
router.get('/university/grenoble', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail8.html'));
});
router.get('/university/humboldt', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail11.html'));
});
router.get('/university/madrid', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail9.html'));
});
router.get('/university/polytechnic', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail10.html'));
});
router.get('/university/heidelberg', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail12.html'));
});
router.get('/university/paris', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail13.html'));
});
router.get('/university/manhim', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail14.html'));
});
router.get('/university/politecnica', (req, res) => {
  res.sendFile(path.join(frontendPath, 'Universitydetail15.html'));
});
router.get('/university/ham', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail6.html'));
});
router.get('/university/ksh', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail7.html'));
});
router.get('/university/artsmun', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail8.html'));
});
router.get('/university/hff', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail9.html'));
});
router.get('/university/mba', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail10.html'));
});
router.get('/university/mua', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail11.html'));
});
router.get('/university/hf', (req, res) => {
  res.sendFile(path.join(frontendPath, 'UniversityGermanydetail12.html'));
});



// Export the router
module.exports = router;
