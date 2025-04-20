// main.js
import { readExcelFile, analyzeData } from './utils/dataProcessor.js';
import { renderCharts } from './utils/chartRenderer.js';
import { generatePDF } from './utils/pdfExporter.js';

window.analyzeMarks = async function () {
  const fileInput = document.getElementById('excelFile');
  if (!fileInput.files.length) {
    alert('Please upload an Excel file.');
    return;
  }

  const file = fileInput.files[0];
  const data = await readExcelFile(file);
  const analysis = analyzeData(data);
  renderCharts(analysis);
  displaySummary(analysis);
  displayTables(analysis);
};

window.exportPDF = function () {
  generatePDF();
};

function displaySummary(analysis) {
  const summary = document.getElementById('summary');
  summary.innerHTML = `
    <h2>Summary</h2>
    <p>Class Pass Percentage: ${analysis.classPassPercentage}%</p>
    <p>Class Fail Percentage: ${analysis.classFailPercentage}%</p>
  `;
}

function displayTables(analysis) {
  document.getElementById('rankList').innerHTML = generateTableHTML('Rank List', analysis.rankList);
  document.getElementById('fullAPlus').innerHTML = generateTableHTML('Full A+ Students', analysis.fullAPlusStudents);
  document.getElementById('failList').innerHTML = generateTableHTML('Failed Students', analysis.failedStudents);
  document.getElementById('improvement').innerHTML = generateTableHTML('Improvement Plan', analysis.improvementPlan);
}

function generateTableHTML(title, data) {
  if (data.length === 0) return `<h2>${title}</h2><p>No data available.</p>`;
  let table = `<h2>${title}</h2><table><thead><tr>`;
  Object.keys(data[0]).forEach(key => table += `<th>${key}</th>`);
  table += '</tr></thead><tbody>';
  data.forEach(row => {
    table += '<tr>';
    Object.values(row).forEach(value => table += `<td>${value}</td>`);
    table += '</tr>';
  });
  table += '</tbody></table>';
  return table;
}
