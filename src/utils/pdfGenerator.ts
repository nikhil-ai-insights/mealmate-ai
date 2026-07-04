import { jsPDF } from 'jspdf';
import { MealPlan, MealDetail } from '../types';

export async function generateMealPlanPDF(plan: MealPlan, userName?: string): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let y = margin;

  // Helper: check page limit & add page
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin + 10;
      drawPageDecorations();
    }
  };

  const drawPageDecorations = () => {
    // Top thin accent bar (Cherry #670527)
    doc.setFillColor(103, 5, 39);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(103, 5, 39);
    doc.text('MEALMATE AI', margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('— Personalized Meals. Smarter Days.', margin + 26, 12);

    // Header Divider Line
    doc.setDrawColor(229, 228, 222); // #E5E4DE
    doc.setLineWidth(0.3);
    doc.line(margin, 15, pageWidth - margin, 15);

    // Footer divider
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated beautifully by MealMate AI on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
    
    // Page count
    const totalPages = doc.getNumberOfPages();
    doc.text(`Page ${totalPages}`, pageWidth - margin - 12, pageHeight - 10);
  };

  // 1. FRONT COVER / BRAND HERO SECTION
  // Top thick Cherry block for visual weight
  doc.setFillColor(103, 5, 39); // Cherry #670527
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title on Cover
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('MealMate AI', margin, 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(187, 215, 152); // Matcha #BBD798
  doc.text('Personalized Meals. Smarter Days.', margin, 23);

  y = 38;

  // Metadata block
  doc.setFillColor(250, 249, 245); // Matcha background #FAF9F5
  doc.setDrawColor(229, 228, 222); // Border #E5E4DE
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(103, 5, 39);
  doc.text('DAILY DIET BLUEPRINT', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  
  // Custom username if present
  const clientName = userName ? userName : 'Valued Client';
  doc.text(`Curated for: ${clientName}`, margin + 6, y + 16);
  doc.text(`Budget Tier: ${plan.budget.status}`, margin + 6, y + 23);
  
  // Right side of card
  doc.text(`Calories Goal: ${plan.nutritionSummary.calories} kcal`, margin + (contentWidth / 2) + 6, y + 16);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin + (contentWidth / 2) + 6, y + 23);

  y += 42;

  // Helper functions for drawing clean styles
  const drawHeading = (text: string) => {
    checkPageBreak(16);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(103, 5, 39); // Cherry
    doc.text(text, margin, y);
    
    // Left decorative visual bar
    doc.setFillColor(187, 215, 152); // Matcha
    doc.rect(margin - 4, y - 4, 2.5, 5.5, 'F');
    
    y += 7;
  };

  const drawParagraph = (text: string, fontSize = 9.5, fontStyle = 'normal', color = [60, 60, 60], lead = 5) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines: string[] = doc.splitTextToSize(text, contentWidth);
    
    for (const line of lines) {
      checkPageBreak(lead + 2);
      doc.text(line, margin, y);
      y += lead;
    }
  };

  const drawMealCard = (title: string, meal: MealDetail) => {
    checkPageBreak(45);
    
    // Sub-title for meal type
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(103, 5, 39); // Cherry
    doc.text(`${title}: ${meal.name}`, margin, y);
    y += 5.5;

    // Quick specs row
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`Portion Estimate: ${meal.calories} kcal  |  Prep: ${meal.prepTime}  |  Difficulty: ${meal.difficulty}`, margin, y);
    y += 5.5;

    // Meal description
    drawParagraph(meal.description, 9, 'italic', [80, 80, 80], 4.5);
    y += 1;

    // Ingredients
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(44, 43, 41);
    doc.text('Ingredients:', margin, y);
    y += 4;
    
    const ingText = meal.ingredients.join(', ');
    drawParagraph(ingText, 8.5, 'normal', [100, 100, 100], 4.2);
    y += 1.5;

    // Instructions
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(44, 43, 41);
    doc.text('Preparation Steps:', margin, y);
    y += 4.5;

    meal.instructions.forEach((step, idx) => {
      drawParagraph(`${idx + 1}. ${step}`, 8.5, 'normal', [90, 90, 90], 4.2);
    });

    // Divider between meals
    y += 4;
    checkPageBreak(10);
    doc.setDrawColor(240, 239, 235);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // 2. RECIPES LIST
  drawHeading('1. Recipes & Meal Schedules');
  
  drawMealCard('Breakfast', plan.breakfast);
  drawMealCard('Lunch', plan.lunch);
  drawMealCard('Dinner', plan.dinner);
  drawMealCard('Snack Suggestion', plan.snack);

  // 3. DAILY MACROS & NUTRITION
  drawHeading('2. Daily Nutrition Tracker & Macros');
  
  const nut = plan.nutritionSummary;
  doc.setFillColor(250, 249, 245);
  doc.setDrawColor(229, 228, 222);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(103, 5, 39);
  
  doc.text(`Total Calories: ${nut.calories} kcal`, margin + 5, y + 8);
  doc.text(`Protein: ${nut.protein}`, margin + 5, y + 16);

  doc.text(`Carbs: ${nut.carbs}`, margin + (contentWidth / 3) + 5, y + 8);
  doc.text(`Fat: ${nut.fat}`, margin + (contentWidth / 3) + 5, y + 16);

  doc.text(`Fiber: ${nut.fiber}`, margin + (contentWidth * 2 / 3) + 5, y + 8);
  
  y += 30;

  // 4. BUDGET ANALYSIS
  drawHeading('3. Daily Budget Feasibility');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(44, 43, 41);
  doc.text(`Estimated Daily Cost: ${plan.budget.estimatedDailyCost}`, margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(103, 5, 39);
  doc.text(`(${plan.budget.status})`, margin + 70, y);
  
  y += 5.5;
  drawParagraph(plan.budget.explanation, 9, 'normal', [80, 80, 80], 4.5);
  y += 4;

  // 5. GROCERY SHOPPING LIST
  drawHeading('4. Grocery Shopping Checklist');
  
  plan.groceryList.forEach((cat) => {
    checkPageBreak(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(103, 5, 39);
    doc.text(cat.category, margin, y);
    y += 5;

    cat.items.forEach((item) => {
      checkPageBreak(8);
      // Small tick-box square
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.rect(margin, y - 3, 3, 3);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`${item.name} (${item.amount})`, margin + 6, y);
      y += 4.5;
    });
    y += 2.5;
  });

  y += 4;

  // 6. SUBSTITUTIONS
  if (plan.ingredientSubstitutions && plan.ingredientSubstitutions.length > 0) {
    drawHeading('5. Smart Ingredient Substitutions');
    
    plan.ingredientSubstitutions.forEach((sub) => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(44, 43, 41);
      doc.text(`Instead of: ${sub.original}  -->  Use: ${sub.substitute}`, margin, y);
      y += 4.5;
      
      drawParagraph(sub.reason, 8.5, 'italic', [100, 100, 100], 4.2);
      y += 2;
    });
  }

  y += 4;

  // 7. CHEF'S COOKING TIPS
  drawHeading("6. Chef's Culinary Insights");
  plan.cookingTips.forEach((tip, idx) => {
    checkPageBreak(15);
    drawParagraph(`${idx + 1}. ${tip}`, 9, 'normal', [70, 70, 70], 4.5);
  });

  // Stamp page decoration on page 1 and then apply decoration logic to all pages retrospectively
  const totalPageCount = doc.getNumberOfPages();
  for (let i = 1; i <= totalPageCount; i++) {
    doc.setPage(i);
    // Draw running headers & footers on every page
    // (Except we bypass cover branding overlap if i is 1)
    if (i > 1) {
      drawPageDecorations();
    } else {
      // Small page number on cover page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page 1 of ${totalPageCount}`, pageWidth - margin - 15, pageHeight - 10);
    }
  }

  // Generate date in format MealMateAI-MealPlan-YYYY-MM-DD.pdf
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const filename = `MealMateAI-MealPlan-${year}-${month}-${day}.pdf`;

  // Save the PDF locally
  doc.save(filename);
}
