import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IInterview } from '../models/schema-design';
import fs from 'fs';
import path from 'path';

/**
 * Service for exporting interview results to PDF
 */
export class InterviewPDFExportService {
  /**
   * Generate a PDF from interview results
   * @param interview The interview data to include in the PDF
   * @param includeAnswers Whether to include answers in the PDF
   * @param includeFeedback Whether to include feedback in the PDF
   * @returns The path to the saved PDF file
   */
  static async generateInterviewPDF(
    interview: IInterview,
    includeAnswers: boolean = true,
    includeFeedback: boolean = true
  ): Promise<string> {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Interview Results: ${interview.stream}`, 14, 22);
    
    // Add metadata
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Started: ${new Date(interview.startedAt).toLocaleString()}`, 14, 35);
    if (interview.endedAt) {
      doc.text(`Completed: ${new Date(interview.endedAt).toLocaleString()}`, 14, 40);
    }
    
    // Add overall score if available
    let yPosition = interview.endedAt ? 45 : 40;
    if (interview.resultSummary) {
      doc.setFontSize(16);
      doc.text('Overall Assessment', 14, yPosition + 5);
      yPosition += 10;
      
      // Add strengths
      if (interview.resultSummary.strengths && interview.resultSummary.strengths.length > 0) {
        doc.setFontSize(12);
        doc.text('Strengths:', 14, yPosition + 5);
        yPosition += 10;
        
        interview.resultSummary.strengths.forEach((strength, index) => {
          doc.setFontSize(10);
          doc.text(`• ${strength}`, 20, yPosition + (index * 5));
        });
        
        yPosition += (interview.resultSummary.strengths.length * 5) + 5;
      }
      
      // Add weaknesses
      if (interview.resultSummary.weaknesses && interview.resultSummary.weaknesses.length > 0) {
        doc.setFontSize(12);
        doc.text('Areas for Improvement:', 14, yPosition + 5);
        yPosition += 10;
        
        interview.resultSummary.weaknesses.forEach((weakness, index) => {
          doc.setFontSize(10);
          doc.text(`• ${weakness}`, 20, yPosition + (index * 5));
        });
        
        yPosition += (interview.resultSummary.weaknesses.length * 5) + 5;
      }
      
      // Add feedback
      if (includeFeedback && interview.resultSummary.feedback) {
        doc.setFontSize(12);
        doc.text('Detailed Feedback:', 14, yPosition + 5);
        yPosition += 10;
        
        const feedbackLines = doc.splitTextToSize(interview.resultSummary.feedback, 180);
        doc.setFontSize(10);
        doc.text(feedbackLines, 14, yPosition + 5);
        
        yPosition += (feedbackLines.length * 5) + 15;
      }
    }
    
    // Prepare table data for questions and answers
    const tableData = interview.questions.map((q, index) => {
      const row = [
        (index + 1).toString(),
        q.question
      ];
      
      // Add response column if includeAnswers is true
      if (includeAnswers && q.response) {
        row.push(q.response);
      }
      
      // Add score column if available
      if (q.score !== undefined) {
        row.push(q.score.toString());
      }
      
      return row;
    });
    
    // Define table headers
    const headers = ['#', 'Question'];
    if (includeAnswers) {
      headers.push('Response');
    }
    headers.push('Score');
    
    // Generate the table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // # column
        1: { cellWidth: includeAnswers ? 70 : 120 }, // Question column
        2: includeAnswers ? { cellWidth: 70 } : { cellWidth: 20 }, // Response or Score column
        3: includeAnswers ? { cellWidth: 20 } : {} // Score column (if responses included)
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontStyle: 'bold',
      },
      didDrawPage: (data) => {
        // Add footer with page numbers
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(
            `Page ${i} of ${pageCount} - Interview Results`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      },
    });
    
    // Ensure the directory exists
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs', 'interviews');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    // Save the PDF to the file system
    const pdfFilename = `interview-${interview._id}-${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFilename);
    
    // Write the PDF to disk
    fs.writeFileSync(pdfPath, Buffer.from(doc.output('arraybuffer')));
    
    // Return the relative path for storage in the database
    return `/pdfs/interviews/${pdfFilename}`;
  }
}