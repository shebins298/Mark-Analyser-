// main.js
import { readExcelFile, analyzeData } from './utils/dataProcessor.js';
import { renderCharts, renderSubjectWiseCharts } from './utils/chartRenderer.js';
import { generatePDF } from './utils/pdfExporter.js';

window.analyzeMarks = async function () {
  const fileInput = document.getElementById('excelFile');
  if (!fileInput.files.length) {
    alert('Please upload an Excel file.');
    return;
  }

  const file = fileInput.files[0];
  try {
    const { studentData, subjectList, maxMarks } = await readExcelFile(file);
    const analysis = analyzeData(studentData, subjectList, maxMarks);
    
    displaySummary(analysis);
    displayTables(analysis);
    renderCharts(analysis.rankList);
    renderSubjectWiseCharts(analysis.subjectStats);

    window.currentAnalysis = analysis; // store for PDF export
  } catch (err) {
    console.error("Error during analysis:", err);
    alert("Error analyzing file. Check console for details.");
  }
};

window.exportPDF = function () {
  if (!window.currentAnalysis) {
    alert("No data to export. Upload and analyze a file first.");
    return;
  }
  generatePDF(window.currentAnalysis);
};

function displaySummary(analysis) {
  const summary = document.getElementById('summary');
  summary.innerHTML = `
    <h2>Summary</h2>
    <p><strong>Class Pass Percentage:</strong> ${analysis.classPassPercentage.toFixed(2)}%</p>
    <p><strong>Class Fail Percentage:</strong> ${analysis.classFailPercentage.toFixed(2)}%</p>
    <p><strong>Total Students:</strong> ${analysis.totalStudents}</p>
  `;
}

function displayTables(analysis) {
  const sections = [
    { id: 'rankList', title: 'Rank List', data: analysis.rankList },
    { id: 'fullAPlus', title: 'Full A+ Students', data: analysis.fullAPlusStudents },
    { id: 'failList', title: 'Failed Students', data: analysis.failedStudents },
    { id: 'improvement', title: 'Improvement Plan', data: analysis.improvementPlan },
  ];

  sections.forEach(({ id, title, data }) => {
    const container = document.getElementById(id);
    container.innerHTML = generateTableHTML(title, data);
  });
}

function generateTableHTML(title, data) {
  if (!data || data.length === 0) {
    return `<h2>${title}</h2><p>No data available.</p>`;
  }

  let html = `<h2>${title}</h2><div class="table-container"><table><thead><tr>`;
  Object.keys(data[0]).forEach(key => {
    html += `<th>${key}</th>`;
  });
  html += `</tr></thead><tbody>`;
  data.forEach(row => {
    html += `<tr>`;
    Object.values(row).forEach(value => {
      html += `<td>${value}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  return html;
}
