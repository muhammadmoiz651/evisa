/**
 * OCR controller for handling image processing and text extraction
 */
class OCRController {
  constructor() {
    this.apiKey = 'AQ.Ab8RN6J6OGDd8JxwUQiybiO1-lf2m6_U_4lganiLzOEPc-hD0A';
    this.modelName = 'gemini-2.5-flash';

    // Define scholarship opportunities
   this.scholarships = {
  france: [
    { scholarship: 'IDEX International Master’s Scholarship', link:'/idex' },
    { scholarship: 'Eiffel Excellence Scholarship' , link:'/eiffel' },
    { scholarship: 'International Selection Scholarship' , link:'/iss' },
    { scholarship: 'Graduate School@UGA Incoming Scholarship' , link:'/uga' },
    { scholarship: 'Eiffel Excellence Scholarship Program' , link:'/eiffels' }
  ],
  spain: [
    { scholarship: 'UB Mobility Grants' , link:'/ub' },
    { scholarship: 'Spanish Arts Scholarship' , link:'/arts' },
    { scholarship: 'UPF Talent Scholarship' , link:'/upf' },
    { scholarship: 'UAM Scholarships for International Students' , link:'/uam' },
    { scholarship: 'Spanish Ministry Scholarships (MEFP Grants)' , link:'/upc' }
  ],
  germany: [
    { scholarship: 'TUM Scholarship for International Students' , link:'/tum' },
    { scholarship: 'Deutschlandstipendium'  , link:'/deut'},
    { scholarship: 'Germany Scholarship (Deutschlandstipendium)' , link:'/schdeuts' },
    { scholarship: 'Study Scholarships - Master Studies for All Academic Disciplines' , link:'/daad' },
    { scholarship: 'KAAD Scholarship for International Students' , link:'/kaad' },
    { scholarship: 'The MBS Education Fund Scholorship' , link:'/schmbs' },
    { scholarship: 'Excellence Scholarship (Merit-Based)'   }
  ]
};


    this.universityTiers = {
  tier1: [
    { name: 'Ludwig Maximilian University of Munich (LMU)', link: '/university/ludwig' },
    { name: 'Technical University of Munich (TUM)', link: '/university/technicaluniversity' },
    { name: 'Paris‑Saclay University', link: '/university/paris-saclay' },
    { name: 'École Normale Supérieure (ENS Paris)', link: '/university/ecol' },
    { name: 'Hochschule Fresenius Munich Campus', link: '/university/hff' },
    { name: 'Macromedia University of Applied Sciences Munich', link: '/university/ham' },
    { name: 'Munich Business School (MBS)', link: '/university/mba' },
    { name: 'HFF München', link: '/university/hff' },
    { name: 'Academy of Fine Arts, Munich', link: '/university/artsmun' },
    { name: 'KSH Munich (Katholische Stiftungshochschule München)', link: '/university/ksh' },
    { name: 'Munich University of Applied Sciences (HM)', link: '/university/ham' },
    { name: 'Universidad Politécnica de Madrid', link: '/university/politecnica' },
    { name: 'University of Mannheim', link: '/university/manhim' },
    { name: 'Université Paris Cité', link: '/university/paris' }
  ],
  tier2: [
    { name: 'University of Heidelberg', link: 'university/heidelberg' },
    { name: 'Humboldt University of Berlin', link: '/university/humboldt' },
    { name: 'Polytechnic University of Catalonia (UPC)', link: '/university/polytechnic' },
    { name: 'Autonomous University of Madrid (UAM)', link: '/university/madrid' },
    { name: 'Université Grenoble Alpes', link: '/university/grenoble' },
    { name: 'Pompeu Fabra University (UPF)', link: '/university/pompeu' },
    { name: 'University of Barcelona (UB)', link: '/university/barcelona' },
    { name: 'Paris 1 Panthéon‑Sorbonne University', link: '/university/pantheon-sorbonne' }
  ],
  tier3: [
    { name: 'Hochschule Fresenius Munich Campus', link: '/university/hff' },
    { name: 'Macromedia University of Applied Sciences Munich', link: '/university/ham' },
    { name: 'Munich Business School (MBS)', link: '/university/mba' },
    { name: 'HFF München', link: '/university/hff' },
    { name: 'Academy of Fine Arts, Munich', link: '/university/artsmun' },
    { name: 'KSH Munich (Katholische Stiftungshochschule München)', link: '/university/ksh' },
    { name: 'Munich University of Applied Sciences (HM)', link: '/university/ham' },
    { name: 'Universidad Politécnica de Madrid', link: '/university/politecnica' },
    { name: 'University of Mannheim', link: '/university/manhim' },
    { name: 'Université Paris Cité', link: '/university/paris' }
  ]
};


    // IELTS score requirements for universities
    this.ieltsRequirements = {
      tier1: 7.0,
      tier2: 6.5,
      tier3: 6.0
    };
  }

  getEligibleUniversities(percentage, ieltsScore = null) {
    let eligibleUniversities = [];
    
    if (ieltsScore !== null) {
      // For IELTS certificates
      if (ieltsScore >= this.ieltsRequirements.tier1) {
        eligibleUniversities = this.universityTiers.tier1;
      } else if (ieltsScore >= this.ieltsRequirements.tier2) {
        eligibleUniversities = this.universityTiers.tier2;
      } else if (ieltsScore >= this.ieltsRequirements.tier3) {
        eligibleUniversities = this.universityTiers.tier3;
      }
    } else {
      // For academic certificates
      if (percentage >= 85) return this.universityTiers.tier1;
      if (percentage >= 80) return this.universityTiers.tier1.tier3;
      if (percentage >= 74) return this.universityTiers.tier3;
    }
    
    return eligibleUniversities;
  }

  async processImage(file) {
    try {
      const base64Image = await this.fileToBase64(file);
      const text = await this.extractTextFromImage(base64Image);
      
      // Check if it's an IELTS certificate
      if (this.isIELTSCertificate(text)) {
        const result = this.extractIELTSInfo(text);
        
        if (result.overallBand) {
          const overallBand = parseFloat(result.overallBand);
          if (overallBand > 5.5) {
            result.eligibility = {
              percentage: overallBand.toFixed(1),
              scholarships: this.getScholarshipOpportunities(),
              universities: this.getEligibleUniversities(null, overallBand)
            };
          }
        }
        return result;
      } else {
        // Process academic certificate
        const result = this.extractCertificateInfo(text);
        if (result.totalMarks && result.obtainedMarks) {
          const percentage = (parseInt(result.obtainedMarks) / parseInt(result.totalMarks)) * 100;
          if (percentage > 70) {
            result.eligibility = {
              percentage: percentage.toFixed(2),
              scholarships: this.getScholarshipOpportunities(),
              universities: this.getEligibleUniversities(percentage)
            };
          }
        }
        return result;
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error('Failed to process the certificate. Please try again with a clearer image.');
    }
  }

  isIELTSCertificate(text) {
    const ieltsIndicators = [
      'ielts',
      'test report form',
      'british council',
      'cambridge assessment',
      'idp',
      'listening',
      'reading',
      'writing',
      'speaking',
      'overall band score',
      'cefr level',
      'candidate number',
      'test date'
    ];

    const lowerText = text.toLowerCase();
    return ieltsIndicators.some(indicator => lowerText.includes(indicator));
  }

  extractIELTSInfo(text) {
    const result = {
      certificateType: 'IELTS',
      listening: null,
      reading: null,
      writing: null,
      speaking: null,
      overallBand: null
    };

    // Split text into lines and clean
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    // Define patterns for band scores
    const bandScorePatterns = {
      listening: /listening\s*:?\s*(\d+\.?\d*)/i,
      reading: /reading\s*:?\s*(\d+\.?\d*)/i,
      writing: /writing\s*:?\s*(\d+\.?\d*)/i,
      speaking: /speaking\s*:?\s*(\d+\.?\d*)/i,
      overall: /overall\s*(?:band\s*)?(?:score\s*)?:?\s*(\d+\.?\d*)/i
    };

    // Look for scores in each line
    for (const line of lines) {
      // Check for listening score
      const listeningMatch = line.match(bandScorePatterns.listening);
      if (listeningMatch && !result.listening) {
        result.listening = listeningMatch[1];
      }

      // Check for reading score
      const readingMatch = line.match(bandScorePatterns.reading);
      if (readingMatch && !result.reading) {
        result.reading = readingMatch[1];
      }

      // Check for writing score
      const writingMatch = line.match(bandScorePatterns.writing);
      if (writingMatch && !result.writing) {
        result.writing = writingMatch[1];
      }

      // Check for speaking score
      const speakingMatch = line.match(bandScorePatterns.speaking);
      if (speakingMatch && !result.speaking) {
        result.speaking = speakingMatch[1];
      }

      // Check for overall band score
      const overallMatch = line.match(bandScorePatterns.overall);
      if (overallMatch && !result.overallBand) {
        result.overallBand = overallMatch[1];
      }
    }

    // If overall band is not found, calculate it from individual scores
    if (!result.overallBand && result.listening && result.reading && result.writing && result.speaking) {
      const scores = [
        parseFloat(result.listening),
        parseFloat(result.reading),
        parseFloat(result.writing),
        parseFloat(result.speaking)
      ];
      
      if (scores.every(score => !isNaN(score))) {
        const average = scores.reduce((a, b) => a + b) / 4;
        result.overallBand = average.toFixed(1);
      }
    }

    return result;
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  async extractTextFromImage(base64Image) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Extract all text from this certificate image. If it's an IELTS certificate, focus on:\n1. The test result section with band scores\n2. Individual scores for Listening, Reading, Writing, Speaking\n3. Overall Band Score\n4. Test Report Form number and date\n\nIf it's an academic certificate, focus on:\n1. The board name at the top\n2. The marks table, especially total marks\n\nMaintain exact formatting and preserve all numbers and decimal points exactly as they appear."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  }

  extractCertificateInfo(text) {
    const result = {
      certificateType: 'Academic',
      boardName: null,
      totalMarks: null,
      obtainedMarks: null
    };

    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const headerLines = lines
      .slice(0, 5)
      .join(" ")
      .replace(/\s+/g, " ")
      .toUpperCase();

    const boardPatterns = [
      /\bFEDERAL\s+BOARD OF (?:INTERMEDIATE(?:\s+AND)?\s+)?(?:SECONDARY\s+)?EDUCATION(?:,?\s*[A-Z\s]+)?\b/,
      /\bBOARD OF (?:INTERMEDIATE(?:\s+AND)?\s+)?(?:SECONDARY\s+)?EDUCATION,?\s*[A-Z\s]+\b/,
      /\b[A-Z\s]+?\s+BOARD OF (?:INTERMEDIATE(?:\s+AND)?\s+)?(?:SECONDARY\s+)?EDUCATION\b/,
      /\bBOARD OF SECONDARY EDUCATION,?\s*[A-Z\s]+\b/,
      /\b[A-Z\s]+?\s+BOARD OF SECONDARY EDUCATION\b/,
      /\b[A-Z\s]+?\s+EXAMINATION BOARD\b/,
      /\b[A-Z\s]+?\s+EDUCATION BOARD\b/,
    ];

    let longestMatch = "";
    for (const pattern of boardPatterns) {
      const match = headerLines.match(pattern);
      if (match && match[0].length > longestMatch.length) {
        longestMatch = match[0];
      }
    }

    if (longestMatch) {
      result.boardName = longestMatch.trim();
    }

    let tableStartIndex = -1;
    let tableEndIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('subject') || line.includes('marks') || line.includes('total')) {
        tableStartIndex = i;
        break;
      }
    }

    if (tableStartIndex !== -1) {
      for (let i = lines.length - 1; i > tableStartIndex; i--) {
        const line = lines[i].toLowerCase();
        if (line.includes('total') || line.includes('grand total')) {
          tableEndIndex = i;
          break;
        }
      }
    }

    if (tableEndIndex !== -1) {
      const lastRow = lines[tableEndIndex];
      const cells = lastRow.split(/[\|:\t]|\s{2,}/)
        .map(cell => cell.trim())
        .filter(Boolean);

      const numbers = cells
        .map(cell => {
          const match = cell.match(/(\d+)/);
          return match ? parseInt(match[1]) : null;
        })
        .filter(num => num !== null);

      if (numbers.length >= 2) {
        const [num1, num2] = numbers;
        if (num1 > num2) {
          result.totalMarks = num1.toString();
          result.obtainedMarks = num2.toString();
        } else {
          result.totalMarks = num2.toString();
          result.obtainedMarks = num1.toString();
        }
      }
    }

    return result;
  }

  getScholarshipOpportunities() {
  const out = [];
  for (const [country, arr] of Object.entries(this.scholarships)) {
    arr.forEach(({ scholarship, link }) => {
      out.push({ country, scholarship, link });   // <-- link add
    });
  }
  return out;
}
}

// Export the OCR controller
const ocrController = new OCRController();