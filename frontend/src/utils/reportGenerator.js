/**
 * PDF Report Generator for Block Plans
 * Generates downloadable block-specific reports for workers and supervisors
 */

import { jsPDF } from 'jspdf';

export function generateBlockReport({ block, relatedTasks, passengerTrains, goodsTrains }) {
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  const contentWidth = rightMargin - leftMargin;

  // Helper function to add text with word wrap
  const addText = (text, x, y, options = {}) => {
    const maxWidth = options.maxWidth || contentWidth;
    const fontSize = options.fontSize || 10;
    const fontStyle = options.fontStyle || 'normal';
    const color = options.color || [0, 0, 0];
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...color);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    
    return y + (lines.length * fontSize * 0.5);
  };

  // Helper function to add section divider
  const addDivider = (y) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, y, rightMargin, y);
    return y + 10;
  };

  // === HEADER ===
  doc.setFillColor(0, 59, 115);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTOMATIC BLOCK PLANNING SYSTEM', leftMargin, 15);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Indian Railways - Maintenance Block Report', leftMargin, 25);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, leftMargin, 33);

  yPos = 50;

  // === BLOCK INFORMATION ===
  yPos = addText('BLOCK INFORMATION', leftMargin, yPos, {
    fontSize: 16,
    fontStyle: 'bold',
    color: [0, 59, 115]
  });
  yPos += 5;
  yPos = addDivider(yPos);

  const blockInfo = [
    ['Block ID:', block.blockId],
    ['Priority:', block.priority],
    ['Date:', new Date().toLocaleDateString()],
    ['Time Window:', `${block.startTime} - ${block.endTime}`],
    ['Duration:', `${block.estimatedDuration} hours`],
    ['Location:', block.location],
    ['Department(s):', block.departments?.join(', ') || 'N/A']
  ];

  blockInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(label, leftMargin, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.text(value, leftMargin + 50, yPos);
    yPos += 7;
  });

  yPos += 5;

  // === MAINTENANCE DETAILS ===
  yPos = addText('MAINTENANCE DETAILS', leftMargin, yPos, {
    fontSize: 16,
    fontStyle: 'bold',
    color: [0, 59, 115]
  });
  yPos += 5;
  yPos = addDivider(yPos);

  if (relatedTasks && relatedTasks.length > 0) {
    relatedTasks.forEach((task, index) => {
      yPos = addText(`Task ${index + 1}: ${task.taskId}`, leftMargin, yPos, {
        fontSize: 12,
        fontStyle: 'bold'
      });
      yPos += 5;

      const taskDetails = [
        ['Department:', task.department],
        ['Asset:', `${task.assetType} - ${task.assetId}`],
        ['Problem:', task.defect],
        ['Criticality:', task.criticality],
        ['Urgency:', task.urgency],
        ['Workers Required:', task.requiredWorkers.toString()],
        ['Equipment:', task.requiredEquipment.join(', ')]
      ];

      taskDetails.forEach(([label, value]) => {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(label, leftMargin + 5, yPos);
        
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(value, contentWidth - 60);
        doc.text(valueLines, leftMargin + 60, yPos);
        yPos += Math.max(7, valueLines.length * 5);
      });

      yPos += 5;
    });
  } else {
    yPos = addText('No specific tasks assigned to this block.', leftMargin, yPos);
    yPos += 5;
  }

  // Check page space
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // === OPERATIONAL INFORMATION ===
  yPos = addText('OPERATIONAL INFORMATION', leftMargin, yPos, {
    fontSize: 16,
    fontStyle: 'bold',
    color: [0, 59, 115]
  });
  yPos += 5;
  yPos = addDivider(yPos);

  const opInfo = [
    ['Passenger Trains Affected:', block.affectedPassengerTrains?.toString() || '0'],
    ['Goods Trains Affected:', block.affectedGoodsTrains?.toString() || '0'],
    ['Required Workers:', block.requiredWorkers?.toString() || 'N/A'],
    ['Operational Risk:', block.affectedPassengerTrains > 0 ? 'HIGH' : 'LOW']
  ];

  opInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label, leftMargin, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.text(value, leftMargin + 70, yPos);
    yPos += 7;
  });

  yPos += 5;

  // === AI RECOMMENDATION ===
  if (block.reasoning) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    yPos = addText('AI RECOMMENDATION', leftMargin, yPos, {
      fontSize: 16,
      fontStyle: 'bold',
      color: [0, 59, 115]
    });
    yPos += 5;
    yPos = addDivider(yPos);

    doc.setFillColor(232, 241, 250);
    const boxHeight = 30;
    doc.rect(leftMargin, yPos, contentWidth, boxHeight, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const reasoningLines = doc.splitTextToSize(block.reasoning, contentWidth - 10);
    doc.text(reasoningLines, leftMargin + 5, yPos + 7);
    yPos += boxHeight + 10;
  }

  // === WORKER INSTRUCTIONS ===
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  yPos = addText('WORKER INSTRUCTIONS', leftMargin, yPos, {
    fontSize: 16,
    fontStyle: 'bold',
    color: [0, 59, 115]
  });
  yPos += 5;
  yPos = addDivider(yPos);

  const instructions = [
    '1. Report to site 30 minutes before block start time',
    '2. Ensure all required equipment is available and functional',
    '3. Conduct safety briefing with all team members',
    '4. Coordinate with signal department before starting work',
    '5. Maintain communication with control room throughout block',
    '6. Complete work within allocated time window',
    '7. Notify control room immediately if work cannot be completed on time',
    '8. Conduct post-work inspection and clearance',
    '9. Submit completion report to supervisor'
  ];

  instructions.forEach(instruction => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    yPos = addText(instruction, leftMargin, yPos, { fontSize: 9 });
    yPos += 6;
  });

  // === FOOTER ===
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | ${block.blockId} | Indian Railways`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // === SAVE PDF ===
  const fileName = `Block_Report_${block.blockId}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
