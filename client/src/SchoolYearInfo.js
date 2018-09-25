import React, {Component} from 'react'
import Plot from 'react-plotly.js'
import * as Plotly from 'plotly.js'
import Carousel from 'react-bootstrap/lib/Carousel'
export default class SchoolYearInfo extends Component {
    constructor(props) {
        super()
        this.state = {
            year: props.year,
            yearInfo: props.yearInfo,
            selected: 'completion',
            openInfo: '',
            actScoresImg:'',
            urls:[],
            pdfDone:false,
        }
        this.handleKeyChange = this.handleKeyChange.bind(this)
    }
    componentWillReceiveProps(props) {
        this.setState({
            year: props.year,
            yearInfo: props.yearInfo,
        })
    }
    handleKeyChange(e,id,key) {
        console.log(this,"REEE")
        e.preventDefault()
        switch(id) {
            case 0:
                console.log(this,"THIS")
                this.setState({openInfo: key});
                break
            case 1:
                console.log(this,"THIS")

                this.setState({selected:key});
                break
            default:
                break
        }
    }
    formatPieChart(info) {
        let values = []
        let labels = []
        Object.keys(info)
            .map((key) => {
            const value = info[key]
            if (value) {
                const formattedKey = key
                    .split('_')
                    .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
                    .join(' ')
                labels.push(formattedKey)
                values.push(value)
            }
        })
        if (values.length === 0) {
            values.push(0)
            labels.push("No Data Available")
        }
        return [
            values,
            labels,
        ]
    }
    filterDemographic(key) {
        const {year} = this.state
        const splitKey = key.split('_')
        if (splitKey.length > 1) {
            if ((splitKey[1] === "2000" || splitKey[1] ===  "prior") &&
                (parseInt(year) > 2007 || year === 'latest')) {
                return false
            }
        }
        return true
    }
    formatPrice(info) {
        const formatted = {
            "0-30000": info["0-30000"],
            "30001-48000": info["30001-48000"],
            "48001-75000": info["48001-75000"],
            "75001-110000": info["75001-110000"],
            "110001-plus": info["110001-plus"]
        }
        return formatted
    }
    exportPDF = () => {
        const refs = ['actScores','satScores','programPercentages','race','gender','netPrice','tuition']
        const urls = refs.map((ref)=> {
            const curr = this.refs[ref]
            return Plotly.toImage(curr.el)
        })
        const self = this
        Promise.all(urls).then(function(results) {
            self.setState({
                urls:results,
                pdfDone:true,
            })
        })
    }
    render() {
        const {urls,yearInfo,pdfDone} = this.state
        const programChartInfo = this.formatPieChart(yearInfo["academics"]["program_percentage"])
        const filteredDemographics = Object.keys(yearInfo["student"]["demographics"]["race_ethnicity"])
            .filter((key) => this.filterDemographic(key))
            .reduce((result,key) => {
               result[key] = yearInfo["student"]["demographics"]["race_ethnicity"][key]
               return result
            },{})
        const demographicChartInfo = this.formatPieChart(filteredDemographics)
        const price = this.formatPrice(yearInfo["cost"]["net_price"]["public"]["by_income_level"])
        const formatPrice = this.formatPieChart(price)
        const satScores = yearInfo["admissions"]["sat_scores"]
        const actScores = yearInfo["admissions"]["act_scores"]
        const formatACTScores = [
            this.formatPieChart(actScores["25th_percentile"]),
            this.formatPieChart(actScores["midpoint"]),
            this.formatPieChart(actScores["75th_percentile"]),
            ]
        const formatSATScores = [
            this.formatPieChart(satScores["25th_percentile"]),
            this.formatPieChart(satScores["midpoint"]),
            this.formatPieChart(satScores["75th_percentile"]),
        ]
        const tuitionInfo = ['Out of State','In State']
        const tuitionHeader =  [["Residency"],["Tuition (USD)"]]
        return (
                <div>
                    {pdfDone
                    ? <div>
                            {urls.map((url,index) => {
                                if (index === 2) {
                                    return (
                                        <div>
                                            <img src={url}/>
                                            <br/>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <img src={url}/>
                                    )
                                }
                            })}
                        </div>
                    : <div>
                            <Carousel>
                                <Carousel.Item>
                                    <Carousel.Caption style={{margin:'20px'}}>
                                        <h3>Admissions</h3>
                                    </Carousel.Caption>
                                    <Plot
                                        id="actScores"
                                        ref="actScores"
                                        data={[
                                            {
                                                type:'scatterpolar',
                                                r: formatACTScores[2][0],
                                                theta: formatACTScores[2][1],
                                                fill: 'toself',
                                                name: '75th Percentile'
                                            },
                                            {
                                                type:'scatterpolar',
                                                r: formatACTScores[1][0],
                                                theta: formatACTScores[1][1],
                                                fill: 'toself',
                                                name: 'Midpoint'
                                            },
                                            {
                                                type:'scatterpolar',
                                                r: formatACTScores[0][0],
                                                theta: formatACTScores[0][1],
                                                fill: 'toself',
                                                name: '25th Percentile'
                                            },

                                        ]}
                                        layout={{
                                            polar: {
                                                radialaxis: {
                                                    visible: true,
                                                    range: [0, 36]
                                                }
                                            },
                                            title: 'ACT Scores',
                                            showlegend: true,
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                    <Plot
                                        id="satScores"
                                        ref="satScores"
                                        data={[
                                            {
                                                type:'scatterpolar',
                                                r: formatSATScores[2][0],
                                                theta: formatSATScores[2][1],
                                                fill: 'toself',
                                                name: '75th Percentile'
                                            },
                                            {
                                                type:'scatterpolar',
                                                r: formatSATScores[1][0],
                                                theta: formatSATScores[1][1],
                                                fill: 'toself',
                                                name: 'Midpoint'
                                            },
                                            {
                                                type:'scatterpolar',
                                                r: formatSATScores[0][0],
                                                theta: formatSATScores[0][1],
                                                fill: 'toself',
                                                name: '25th Percentile'
                                            },

                                        ]}
                                        layout={{
                                            polar: {
                                                radialaxis: {
                                                    visible: true,
                                                    range: [0, 800]
                                                }
                                            },
                                            title: 'SAT Scores',
                                            showlegend: true,
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Carousel.Caption>
                                        <h3>Academics</h3>
                                    </Carousel.Caption>
                                    <Plot
                                        id="programPercentages"
                                        ref="programPercentages"
                                        data = {[{
                                            values: programChartInfo[0],
                                            labels: programChartInfo[1],
                                            hole: .6,
                                            type: 'pie'
                                        }]}
                                        layout = {{
                                            title: 'Program Percentages',
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Carousel.Caption>
                                        <h3>Demographics</h3>
                                    </Carousel.Caption>
                                    <Plot
                                        id="race"
                                        ref="race"
                                        data = {[{
                                            values: demographicChartInfo[0],
                                            labels: demographicChartInfo[1],
                                            hole: .6,
                                            type: 'pie'
                                        }]}
                                        layout = {{
                                            title: 'Race/Ethnicity',
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                    <Plot
                                        id="gender"
                                        ref="gender"
                                        data = {[{
                                            values: [yearInfo["student"]["demographics"]["men"],yearInfo["student"]["demographics"]["women"]],
                                            labels: ['Men','Women'],
                                            hole: .6,
                                            type: 'pie'
                                        }]}
                                        layout = {{
                                            title: 'Gender',
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <Carousel.Caption>
                                        <h3>Cost Of Attendance</h3>
                                    </Carousel.Caption>
                                    <Plot
                                        id="tuition"
                                        ref="tuition"
                                        data = {[{
                                            type:'table',
                                            header: {
                                                values: tuitionHeader,
                                            },
                                            cells: {
                                                values: [
                                                    tuitionInfo,
                                                    [
                                                        '$'+yearInfo['cost']['tuition']['out_of_state'],
                                                        '$'+yearInfo['cost']['tuition']['in_state']
                                                    ]
                                                ]
                                            }
                                        }]}
                                        layout={{
                                            title: 'Tuition By Residency',
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                    <Plot
                                        id="netPrice"
                                        ref="netPrice"
                                        data = {[{
                                            y: formatPrice[0],
                                            x: formatPrice[1],
                                            type: 'bar'
                                        }]}
                                        layout = {{
                                            title: 'Average Net Price Per Income Bracket',
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        config ={
                                            {displayModeBar: false}
                                        }
                                    />
                                </Carousel.Item>
                            </Carousel>;
                        </div>}
            </div>
        )
    }
}