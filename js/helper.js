Vue.filter('setDate', function (rec) {
    var html = '';
    html = rec.substr(rec.length - 2, rec.length) + '号';
    return html;
});
Vue.filter('setIcon', function (ret) {
    var html = '';
    switch (ret) {
        case '晴':
            html = 'icon-tianqi2';
            break;
        case '阴':
            html = 'icon-tianqi1';
            break;
        case '多云':
            html = 'icon-tianqi';
            break;
        default:
            html = 'icon-tianqi';
            break;
    }
    return html;
});