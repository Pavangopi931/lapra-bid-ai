import crypto from 'crypto';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { PDFParse } from 'pdf-parse';

const execFileAsync = promisify(execFile);

/*
 * ============================================================
 * FIELD PATTERNS
 * ============================================================
 */

const FIELD_PATTERNS = {
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/i,

  gstin: /\b\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d]Z[A-Z\d]\b/i,

  udyamRegNo: /\bUDYAM-[A-Z]{2}-\d{2}-\d{7}\b/i,

  epfoCode:
    /\b[A-Z]{2}\/[A-Z]{2,6}\/\d{7}\/\d{3}\b/i,

  esicCode:
    /\b\d{17}\b/,

  startupDpiitNo:
    /\bDIPP\d{5,12}\b/i,

  nsicCertNo:
    /\bNSIC\/[A-Z]{2,5}\/[A-Z]{3}\/\d{4}\/\d{5}\b/i,

  oemAuthorizationCode:
    /\bMAF-[A-Z0-9-]{6,}\b/i,

  /*
   * Generic local-content percentage.
   *
   * Examples:
   * Local Content 75%
   * Local Content: 75 %
   * Local value addition 60%
   */
  localContentPercentage:
    /(?:local\s+content|local\s+value\s+addition|indigenous)[^\d]{0,40}(\d{1,3}(?:\.\d+)?)\s*%/i
};


/*
 * ============================================================
 * DOCUMENT CLASSIFICATION
 * ============================================================
 */

function classifyDocument(filename = '') {
  const name = filename.toLowerCase();

  if (name.includes('udyam') || name.includes('msme')) {
    return 'MSME';
  }

  if (name.includes('gst')) {
    return 'GST';
  }

  if (
    name.includes('itr') ||
    name.includes('tax') ||
    name.includes('26as')
  ) {
    return 'ITR';
  }

  if (
    name.includes('mii') ||
    name.includes('make_in_india') ||
    name.includes('local_content')
  ) {
    return 'MII';
  }

  if (
    name.includes('oem') ||
    name.includes('maf') ||
    name.includes('authorization')
  ) {
    return 'OEM_MAF';
  }

  if (
    name.includes('epfo') ||
    name.includes('esic') ||
    name.includes('challan') ||
    name.includes('labor')
  ) {
    return 'LABOR';
  }

  if (
    name.includes('startup') ||
    name.includes('dpiit')
  ) {
    return 'STARTUP';
  }

  if (name.includes('nsic')) {
    return 'NSIC';
  }

  if (
    name.includes('digi') ||
    name.includes('locker')
  ) {
    return 'DIGILOCKER';
  }

  return 'GENERAL';
}


/*
 * ============================================================
 * TEXT NORMALIZATION
 * ============================================================
 */

function normalizeText(text) {
  return String(text || '')
    .replace(/\u0000/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}


/*
 * ============================================================
 * NUMBER / MONEY HELPERS
 * ============================================================
 */

/**
 * Convert extracted numeric text into a JavaScript number.
 *
 * Supports:
 * 13
 * 13.50
 * 1,250
 * 12,50,000
 */
function parseNumber(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const cleaned = String(value)
    .replace(/,/g, '')
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
}


/**
 * Normalize money units.
 *
 * Examples:
 * crore / cr -> crore
 * lakh / lakhs -> lakh
 */
function normalizeMoneyUnit(unit) {
  if (!unit) {
    return 'rupees';
  }

  const normalized = unit.toLowerCase().trim();

  if (
    normalized === 'crore' ||
    normalized === 'crores' ||
    normalized === 'cr'
  ) {
    return 'crore';
  }

  if (
    normalized === 'lakh' ||
    normalized === 'lakhs' ||
    normalized === 'lac' ||
    normalized === 'lacs'
  ) {
    return 'lakh';
  }

  return 'rupees';
}


/**
 * Convert an extracted money value into a consistent object.
 */
function createMoneyObject(amount, unit) {
  const parsedAmount = parseNumber(amount);

  if (parsedAmount === null) {
    return null;
  }

  return {
    amount: parsedAmount,
    unit: normalizeMoneyUnit(unit)
  };
}


/*
 * ============================================================
 * GE-M TURNOVER EXTRACTION
 * ============================================================
 *
 * GeM documents often contain text such as:
 *
 * Minimum Average Annual Turnover of the bidder
 * (For 3 Years)
 * 13 Lakh (s)
 *
 * OEM Average Turnover (Last 3 Years)
 * 109 Lakh (s)
 *
 * Therefore we cannot simply search:
 *
 * turnover -> number
 *
 * because PDF extraction may insert multiple words/newlines
 * between "turnover" and the actual value.
 */


/**
 * Extract bidder minimum turnover.
 */
function extractBidderMinimumTurnover(text) {
  const patterns = [
    /*
     * Example:
     * Minimum Average Annual Turnover of the bidder
     * (For 3 Years)
     * 13 Lakh (s)
     */
    /minimum\s+average\s+annual\s+turnover\s+of\s+the\s+bidder[\s\S]{0,180}?₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i,

    /*
     * More tolerant variant.
     */
    /minimum\s+average\s+annual\s+turnover[\s\S]{0,180}?₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i,

    /*
     * Generic bidder turnover requirement.
     */
    /minimum\s+(?:average\s+)?(?:annual\s+)?turnover[\s\S]{0,150}?₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const result = createMoneyObject(match[1], match[2]);

      if (result) {
        return result;
      }
    }
  }

  return null;
}


/**
 * Extract OEM average turnover.
 */
function extractOemAverageTurnover(text) {
  const patterns = [
    /*
     * Example:
     * OEM Average Turnover (Last 3 Years)
     * 109 Lakh (s)
     */
    /OEM\s+average\s+turnover[\s\S]{0,150}?₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i,

    /*
     * More tolerant OCR/PDF variant.
     */
    /OEM[\s\S]{0,40}?average\s+turnover[\s\S]{0,150}?₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const result = createMoneyObject(match[1], match[2]);

      if (result) {
        return result;
      }
    }
  }

  return null;
}


/**
 * Extract claimed/general turnover from bidder documents.
 *
 * This is intentionally separate from tender minimum turnover.
 *
 * Example:
 * Claimed Turnover: ₹ 12.50 Cr
 */
function extractGenericTurnover(text) {
  const patterns = [
    /(?:claimed\s+turnover|turnover\s+claimed)[^₹\d]{0,50}₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)?\b/i,

    /(?:gross\s+turnover|annual\s+turnover)[^₹\d]{0,80}₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)?\b/i,

    /(?:turnover)[^₹\d]{0,80}₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakhs?|lacs?)\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const result = createMoneyObject(
        match[1],
        match[2]
      );

      if (result) {
        return result;
      }
    }
  }

  return null;
}


/*
 * ============================================================
 * EXPERIENCE EXTRACTION
 * ============================================================
 */

function extractMinimumExperience(text) {
  const patterns = [
    /minimum\s+(?:years?\s+of\s+)?experience[\s\S]{0,100}?(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i,

    /experience\s+criteria[\s\S]{0,100}?(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const value = Number(match[1]);

      if (Number.isFinite(value)) {
        return value;
      }
    }
  }

  return null;
}


/*
 * ============================================================
 * EMD EXTRACTION
 * ============================================================
 */

function extractEmdAmount(text) {
  const patterns = [
    /EMD\s+Amount\s+₹?\s*([\d,]+(?:\.\d+)?)/i,

    /Earnest\s+Money\s+Deposit\s*\(EMD\)[^\d]{0,80}₹?\s*([\d,]+(?:\.\d+)?)/i,

    /EMD[^\d]{0,50}₹?\s*([\d,]+(?:\.\d+)?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const amount = parseNumber(match[1]);

      if (amount !== null) {
        return {
          amount,
          unit: 'rupees'
        };
      }
    }
  }

  return null;
}


/*
 * ============================================================
 * LOCAL CONTENT EXTRACTION
 * ============================================================
 *
 * GeM documents may say:
 *
 * Minimum 50% ... Class 1
 * and
 * 25% ... Class 2
 *
 * So we extract both where possible.
 */

function extractLocalContent(text) {
  const result = {};

  /*
   * First try direct "local content" declaration.
   */
  const declaredMatch = text.match(
    /(?:local\s+content|local\s+value\s+addition|indigenous)[\s\S]{0,100}?(\d{1,3}(?:\.\d+)?)\s*%/i
  );

  if (declaredMatch) {
    result.declared = Number(declaredMatch[1]);
  }

  /*
   * Class 1 local content.
   *
   * Example:
   * Minimum 50% ... Class 1
   */
  const class1Match = text.match(
    /minimum\s+(\d{1,3}(?:\.\d+)?)\s*%[\s\S]{0,80}?class\s*1/i
  );

  if (class1Match) {
    result.class1Minimum = Number(class1Match[1]);
  }

  /*
   * Class 2 local content.
   *
   * Example:
   * Class 1 and Class 2 ...
   * 50% and 25%
   */
  const combinedClassMatch = text.match(
    /minimum\s+(\d{1,3}(?:\.\d+)?)\s*%[\s\S]{0,40}?and\s+(\d{1,3}(?:\.\d+)?)\s*%[\s\S]{0,80}?class\s*1[\s\S]{0,30}?class\s*2/i
  );

  if (combinedClassMatch) {
    result.class1Minimum = Number(combinedClassMatch[1]);
    result.class2Minimum = Number(combinedClassMatch[2]);
  }

  /*
   * If nothing useful was extracted, return null.
   */
  if (Object.keys(result).length === 0) {
    return null;
  }

  return result;
}


/*
 * ============================================================
 * MAIN FIELD EXTRACTION
 * ============================================================
 */

function extractFields(text) {
  const fields = {};

  /*
   * ----------------------------------------------------------
   * Standard identity fields
   * ----------------------------------------------------------
   */

  for (const [key, pattern] of Object.entries(FIELD_PATTERNS)) {
    /*
     * Turnover and local content are handled separately below.
     */
    if (
      key === 'turnover' ||
      key === 'localContentPercentage'
    ) {
      continue;
    }

    const match = text.match(pattern);

    if (!match) {
      continue;
    }

    fields[key] = match[0].toUpperCase();
  }


  /*
   * ----------------------------------------------------------
   * Bidder minimum turnover
   * ----------------------------------------------------------
   */

  const bidderMinimumTurnover =
    extractBidderMinimumTurnover(text);

  if (bidderMinimumTurnover) {
    fields.bidderMinimumTurnover = bidderMinimumTurnover;
  }


  /*
   * ----------------------------------------------------------
   * OEM average turnover
   * ----------------------------------------------------------
   */

  const oemAverageTurnover =
    extractOemAverageTurnover(text);

  if (oemAverageTurnover) {
    fields.oemAverageTurnover = oemAverageTurnover;
  }


  /*
   * ----------------------------------------------------------
   * Generic / claimed turnover
   * ----------------------------------------------------------
   */

  const genericTurnover =
    extractGenericTurnover(text);

  if (genericTurnover) {
    fields.turnover = genericTurnover;
  }


  /*
   * ----------------------------------------------------------
   * Local content
   * ----------------------------------------------------------
   */

  const localContent = extractLocalContent(text);

  if (localContent) {
    fields.localContent = localContent;

    /*
     * Maintain compatibility with existing backend code.
     */
    if (localContent.declared !== undefined) {
      fields.localContentPercentage =
        localContent.declared;
    } else if (
      localContent.class1Minimum !== undefined
    ) {
      fields.localContentPercentage =
        localContent.class1Minimum;
    }
  }


  /*
   * ----------------------------------------------------------
   * Experience
   * ----------------------------------------------------------
   */

  const minimumExperience =
    extractMinimumExperience(text);

  if (minimumExperience !== null) {
    fields.minimumExperienceYears =
      minimumExperience;
  }


  /*
   * ----------------------------------------------------------
   * EMD
   * ----------------------------------------------------------
   */

  const emdAmount = extractEmdAmount(text);

  if (emdAmount) {
    fields.emd = emdAmount;
  }


  return fields;
}


/*
 * ============================================================
 * PDF TEXT EXTRACTION
 * ============================================================
 */

async function extractPdfText(buffer, originalname) {
  let parser;

  try {
    parser = new PDFParse({
      data: buffer
    });

    const result = await parser.getText();

    const text = normalizeText(result.text);

    if (text.length >= 30) {
      return text;
    }

    return '';
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
}


/*
 * ============================================================
 * IMAGE OCR
 * ============================================================
 */

async function extractImageText(buffer, originalname) {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'gem-verify-')
  );

  /*
   * Sanitize filename for temporary storage.
   */
  const safeFilename = originalname.replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  );

  const inputPath = path.join(
    tempDir,
    safeFilename
  );

  try {
    await fs.writeFile(inputPath, buffer);

    const { stdout } = await execFileAsync(
      'tesseract',
      [
        inputPath,
        'stdout',
        '--psm',
        '6'
      ],
      {
        maxBuffer: 2 * 1024 * 1024
      }
    );

    return normalizeText(stdout);
  } finally {
    await fs.rm(
      tempDir,
      {
        recursive: true,
        force: true
      }
    ).catch(() => {});
  }
}


/*
 * ============================================================
 * PUBLIC API
 * ============================================================
 */

export async function processUploadedDocument(file) {
  /*
   * ----------------------------------------------------------
   * SHA-256 HASH
   * ----------------------------------------------------------
   */

  const hash = crypto
    .createHash('sha256')
    .update(file.buffer)
    .digest('hex');


  /*
   * ----------------------------------------------------------
   * INITIAL STATE
   * ----------------------------------------------------------
   */

  let extractedText = '';

  let extractionMethod = 'NONE';

  let extractionError = null;


  /*
   * ----------------------------------------------------------
   * DOCUMENT EXTRACTION
   * ----------------------------------------------------------
   */

  try {
    /*
     * PDF
     */
    if (
      file.mimetype === 'application/pdf' ||
      file.originalname
        .toLowerCase()
        .endsWith('.pdf')
    ) {
      extractedText = await extractPdfText(
        file.buffer,
        file.originalname
      );

      extractionMethod = extractedText
        ? 'PDF_TEXT_OR_OCR'
        : 'PDF_NO_TEXT';
    }

    /*
     * IMAGE
     */
    else if (
      file.mimetype &&
      file.mimetype.startsWith('image/')
    ) {
      extractedText = await extractImageText(
        file.buffer,
        file.originalname
      );

      extractionMethod = extractedText
        ? 'OCR'
        : 'IMAGE_NO_TEXT';
    }
  } catch (error) {
    extractionError = error.message;

    console.warn(
      `[Document Intelligence] Extraction failed for ${file.originalname}: ${error.message}`
    );
  }


  /*
   * ----------------------------------------------------------
   * STRUCTURED FIELD EXTRACTION
   * ----------------------------------------------------------
   */

  const fields = extractFields(
    extractedText
  );


  /*
   * ----------------------------------------------------------
   * FINAL DOCUMENT OBJECT
   * ----------------------------------------------------------
   */

  return {
    id: `doc-custom-${Date.now()}-${crypto
      .randomBytes(3)
      .toString('hex')}`,

    name: file.originalname,

    mimeType: file.mimetype,

    type: classifyDocument(
      file.originalname
    ),

    size: `${(
      file.size /
      1024 /
      1024
    ).toFixed(2)} MB`,

    sha256: hash,

    hashValid: null,

    hashVerificationStatus:
      'NOT_VERIFIED',

    verifiedStatus: extractedText
      ? 'EXTRACTED_PENDING_VERIFICATION'
      : 'EXTRACTION_REQUIRED',

    extractionMethod,

    extractionError,

    /*
     * Keep database/API payload size controlled.
     */
    extractedText:
      extractedText.slice(0, 20000),

    extractedFields: fields
  };
}