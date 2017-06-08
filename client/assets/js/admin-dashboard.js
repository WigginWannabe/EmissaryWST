jQuery(document).ready(function($)
{
    // Sparkline Charts
    $(".monthly-sales").sparkline([1,5,6,7,10,12,16,11,9,8.9,8.7,7,8,7,6,5.6,5,7,5,4,5,6,7,8,6,7,6,3,2], {
        type: 'bar',
        barColor: '#5d41a6',
        height: '80px',
        barWidth: 10,
        barSpacing: 2
    });

    $(".pie-chart").sparkline('html', {
        type: 'pie',
        width: '100',
        height: '100',
        sliceColors: ['#fffa74','#74db4a']
    });
});

