# lvr-widgets


## assumed shape of data

## at /stratum/api/statistics/lvr/gaugeWidget
for ratio Gauges

### Logic depending on following implementation can be found at
 - definitions/stores : ratioGaugeStore and ratioGaugeModel // expects this shape and url in its proxy
 - definitions/ratioGauge  // handles the view logic for this data.
~~~~
{
    d: [{
        description : [String],
        id : [String],
        invert : [Boolean],
        limit : [Number],
        value : [Number]
    }]
}
~~~~

## at /stratum/api/statistics/lvr/gaugeWidget?id=[id]

### Logic depending on following implementation can be found at.
 - utils/methods/ :loadMainChart() // for business logic.
 - utils/methods/ : getChartData() // for the url, and fetching
 - /init : onGaugeClickFactory() // for parsing the data.
~~~~
{
    d: {
        id: [String],
        data: {
            "indicator" : [String],
            "invert" : [Boolean],
            "descName" : [String],
            "description" : [String],
            "limit" : [Number],
            "colors" : [String[]],
            "sums" : {
                "ClinicALL=0" : [Number],
                "ClinicALL=1" : [Number]
            },
            "ClinicALL=0" : {
                "Okänt" : [Number],
                "Ej erhållit utbildning" : [Number],
                "Erhållit utbildning" : [Number]
            },
            "value" : [Number],
            "ClinicALL=1" : {
                "Okänt" : [Number],
                "Ej erhållit utbildning" : [Number],
                "Erhållit utbildning" : [Number]
            }
        }
    }
}
~~~~