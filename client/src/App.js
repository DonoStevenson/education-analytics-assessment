import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import { PDFExport } from '@progress/kendo-react-pdf';
import SchoolYearInfo from "./SchoolYearInfo";
import {CSVLink} from 'react-csv';
import Button from 'react-bootstrap/lib/Button'
import PageHeader from 'react-bootstrap/lib/PageHeader'
class App extends Component {
    state = {
        response:'',
        school: undefined,
        yearInfo: [],
        info: '',
        selectedYear:'latest',
        slider:21,
    }
    formatSchoolInfo(data) {
        console.log(data)
        const schoolInfo = data.results[0]
        this.setState({
            school: schoolInfo.school,
            yearInfo: Object.keys(schoolInfo)
                .filter((key) => key.charAt(0) === "1" || key.charAt(0) === "2" || key === "latest")
                .reduce((res,key) => {
                    res[key] = schoolInfo[key]
                    return res
                },{}),
            schoolInfo,
        })
    }
    componentDidMount() {
        fetch('/schools')
            .then(res => res.json())
            .then(json => this.formatSchoolInfo(json))
    }
    exportPDForPrint = (type) => {
        const schoolYearInfo = this.refs.schoolYearInfo
        const pdf = this.pdf
        schoolYearInfo.exportPDF()
        const timer = setInterval(function(){
            console.log(schoolYearInfo.state.pdfDone)
            if (schoolYearInfo.state.pdfDone) {
                if (type) {
                    window.print()
                } else {
                    pdf.save()
                }
                clearInterval(timer)
                setTimeout(function(){
                    schoolYearInfo.setState({
                        pdfDone:false,
                })},500)
            }
        },500)
    }
    render() {
      const {schoolInfo} = this.state
      if (!schoolInfo) {
          return (
              <div style={{margin:'20%'}}>
                  <img src={logo} className="App-logo" alt="logo" /><br/>
                  Loading School Information...
              </div>
          )
      } else {
          const {year,selectedYear,school,info,yearInfo,slider} = this.state
          const fullUrl = `https://${school.school_url}`
          const years = Object.keys(yearInfo).map((key)=> {
              return key
          })
          return (
              <PDFExport
                         fileName="schoolYearInfo.pdf"
                         ref={(r) => this.pdf = r}>
              <div className="container-fluid">
                  <PageHeader>
                      {school.name}<br/>
                      <small>Location: {school.city}, {school.state} {school.zip}</small><br/>
                      <small>Website: <a href={fullUrl}>{fullUrl}</a></small><br/>
                      <small>Enrollment: {schoolInfo['latest'].student.size}</small>
                  </PageHeader>;
                  <span>Selected Year: {selectedYear}</span>
                  <br/>
                  <input
                      class="slider is-fullwidth"
                    type="range"
                    min="0"
                    max={years.length-1}
                    step="1"
                    value={slider}
                    onChange={(e) => this.setState({
                        slider:e.target.value,
                        selectedYear: years[e.target.value]
                    })}
                    />
                  <SchoolYearInfo
                  ref="schoolYearInfo"
                  id="schoolYearInfo"
                  year={selectedYear}
                  yearInfo={yearInfo[selectedYear]}/>
              </div>
                  <CSVLink data={[
                      yearInfo[selectedYear]["academics"]["program_percentage"],
                      yearInfo[selectedYear]["student"]["demographics"]["race_ethnicity"],
                      yearInfo[selectedYear]["cost"]["net_price"]["public"]["by_income_level"],
                      yearInfo[selectedYear]["admissions"]["act_scores"],
                      yearInfo[selectedYear]["admissions"]["sat_scores"],
                      yearInfo[selectedYear]["student"]["demographics"],
                      yearInfo[selectedYear]['cost']['tuition'],
                  ]}>
                      <Button bsStyle="primary">Download Data</Button>
                  </CSVLink>
                  <Button bsStyle="primary" onClick={() => this.exportPDForPrint(false)}>Download PDF</Button>
                  <Button bsStyle="primary" onClick={() => this.exportPDForPrint(true)}>Print Page</Button>
              </PDFExport>
          );
      }
  }
}

export default App;
