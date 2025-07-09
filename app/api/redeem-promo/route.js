import UsedPromoCode from "@/models/UsedPromoCode";

const luckyNumbers = {
  // "eShopA823": 87, 
  // "eShopA492": 39,
  // "eShopA192": 74,
  // "eShopA765": 55,
  // "eShopA318": 61,
  // "eShopA654": 93,
  // "eShopA105": 28,
  // "eShopA907": 42,
  // "eShopA231": 17,
  // "eShopA379": 66,
  // "eShopA000": 77,
  // "eShopA111": 7,

};

// In-memory stores for demo (replace with DB in production)
const userAttempts = new Map(); // userId -> { attempts: number, hasWon: boolean }
const claimedNumbers = new Set(); // numbers that have been claimed

export async function POST(req) {
  try {
    const { userId, guessedNumber } = await req.json();
    if (!userId || typeof guessedNumber !== 'number') {
      return Response.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    // Get user state
    let userState = userAttempts.get(userId) || { attempts: 0, hasWon: false };
    if (userState.hasWon) {
      return Response.json({ success: false, error: 'You have already won a promo code.' }, { status: 400 });
    }
    if (userState.attempts >= 3) {
      return Response.json({ success: false, error: 'No attempts left.' }, { status: 400 });
    }

    // Find the promo code that matches the guessed number
    const promoEntry = Object.entries(luckyNumbers).find(([code, number]) => number === guessedNumber);
    
    if (promoEntry && !claimedNumbers.has(guessedNumber)) {
      const [promoCode, luckyNumber] = promoEntry;

      // 1. Check if promo code is already used in database
      const alreadyUsed = await UsedPromoCode.findOne({ code: promoCode });
      if (alreadyUsed) {
        return Response.json({ success: false, error: "Promo code already used." }, { status: 400 });
      }

      // 2. Mark number as claimed in memory
      claimedNumbers.add(guessedNumber);
      
      // 3. Update user state
      userAttempts.set(userId, { attempts: userState.attempts + 1, hasWon: true });

      // 4. Mark promo code as used in database
      await UsedPromoCode.create({ 
        code: promoCode, 
        usedBy: userId,
        usedAt: new Date()
      });

      // 5. Return success with promo code
      return Response.json({ 
        success: true, 
        promoCode,
        message: `Congratulations! You won with number ${guessedNumber}!`
      });
      
    } else {
      // Not a winner or already claimed
      userAttempts.set(userId, { attempts: userState.attempts + 1, hasWon: false });
      
      const remainingAttempts = 3 - (userState.attempts + 1);
      const errorMessage = claimedNumbers.has(guessedNumber) 
        ? 'This winning number has already been claimed by another user.'
        : `Not a winning number. You have ${remainingAttempts} attempts left.`;
        
      return Response.json({ 
        success: false, 
        error: errorMessage,
        attemptsRemaining: remainingAttempts
      });
    }
  } catch (error) {
    console.error('Promo redemption error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
