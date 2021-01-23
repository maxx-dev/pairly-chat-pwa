import React, { Component } from 'react';


export default class SVGIcons extends Component {

    constructor(props) {
        super();
        this.state = {}
    }



    render(){
        const { type } = this.props;
        let icon = '';
        let defProps = {
            xml:'http://www.w3.org/2000/svg',
            width:24,
            height:24,
            className:this.props.className,
            viewBox: '0 0 24 24',
            onClick:this.props.onClick ? this.props.onClick.bind(this) : null
        };
        if (type === 'LOGO')
        {
            icon = <svg {...defProps} viewBox="0 0 512.004 512.004"><g><path fill="currentColor" d="M468.715,349.826C497.835,314.05,512,276.311,512,234.669c0-117.632-114.837-213.333-256-213.333S0,117.037,0,234.669
			s114.837,213.333,256,213.333c37.867,0,56.299-7.232,82.432-18.283c39.509,26.688,89.835,42.389,126.315,53.781
			c6.955,2.176,13.44,4.181,19.243,6.101c2.197,0.725,4.459,1.067,6.677,1.067c7.253,0,14.208-3.712,18.176-10.155
			c5.184-8.405,3.883-19.264-3.093-26.261C468.885,417.367,467.925,366.551,468.715,349.826z M128,277.335
			c-23.573,0-42.667-19.093-42.667-42.667c0-23.573,19.093-42.667,42.667-42.667c23.573,0,42.667,19.093,42.667,42.667
			C170.667,258.242,151.573,277.335,128,277.335z M256,277.335c-23.573,0-42.667-19.093-42.667-42.667
			c0-23.573,19.093-42.667,42.667-42.667s42.667,19.093,42.667,42.667C298.667,258.242,279.573,277.335,256,277.335z M384,277.335
			c-23.573,0-42.667-19.093-42.667-42.667c0-23.573,19.093-42.667,42.667-42.667c23.573,0,42.667,19.093,42.667,42.667
			C426.667,258.242,407.573,277.335,384,277.335z"/>
	</g>
</svg>
        }
        if (type === 'DOUBLE_CHECK')
        {
            icon = <svg {...defProps} viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
        }
        if (type === 'SINGLE_CHECK')
        {
            icon = <svg {...defProps} viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
        }
        if (type === 'EMOJI')
        {
            //return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg>
            icon= <svg {...defProps}><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
        }
        if (type === 'SEARCH')
        {
            icon = <svg {...defProps} width="93px" height="94px" viewBox="0 0 93 94">
                    <path fill="currentColor" d="M37.7793,75.62695 C45.9336,75.62695 53.4531,72.9902 59.6055,68.5957 L82.75,91.74023 C83.8242,92.81445 85.2402,93.3516 86.7539,93.3516 C89.928,93.3516 92.174,90.91016 92.174,87.78516 C92.174,86.32031 91.686,84.95312 90.611,83.878906 L67.6133,60.832 C72.4473,54.4844 75.3281,46.623 75.3281,38.0781 C75.3281,17.4238 58.4336,0.5293 37.7793,0.5293 C17.125,0.5293 0.2305,17.4238 0.2305,38.0781 C0.2305,58.7324 17.125,75.62695 37.7793,75.62695 Z M37.7793,67.5215 C21.666,67.5215 8.3359,54.1914 8.3359,38.0781 C8.3359,21.9648 21.666,8.6348 37.7793,8.6348 C53.8926,8.6348 67.2227,21.9648 67.2227,38.0781 C67.2227,54.1914 53.8926,67.5215 37.7793,67.5215 Z"></path>
                </svg>
        }
        if (type === 'TAIL_IN')
        {
            icon = <svg{...defProps} viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>
        }
        if (type === 'TAIL_OUT')
        {
            icon = <svg {...defProps} viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg>
        }
        if (type === 'MICRO')
        {
            icon =
                <svg {...defProps} width="71px" height="105px" viewBox="0 0 71 105">
                  <path fill="currentColor" d="M35.8047,68.5391 C45.5215,68.5391 52.0645,61.2637 52.0645,50.8633 L52.0645,18.1973 C52.0645,7.748 45.5215,0.5215 35.8047,0.5215 C26.0391,0.5215 19.4961,7.748 19.4961,18.1973 L19.4961,50.8633 C19.4961,61.2637 26.0391,68.5391 35.8047,68.5391 Z M0.8438,51.6445 C0.8438,70.7852 13.4902,84.21289 32.0938,85.77539 L32.0938,97.15234 L13.9785,97.15234 C11.9277,97.15234 10.2676,98.8125 10.2676,100.86328 C10.2676,102.9141 11.9277,104.5254 13.9785,104.5254 L57.582,104.5254 C59.6328,104.5254 61.293,102.9141 61.293,100.86328 C61.293,98.8125 59.6328,97.15234 57.582,97.15234 L39.4668,97.15234 L39.4668,85.77539 C58.1191,84.21289 70.7168,70.7852 70.7168,51.6445 L70.7168,41.7324 C70.7168,39.6816 69.1055,38.0703 67.0547,38.0703 C65.0039,38.0703 63.3438,39.6816 63.3438,41.7324 L63.3438,51.3516 C63.3438,68.002 52.5039,79.0371 35.8047,79.0371 C19.0566,79.0371 8.2168,68.002 8.2168,51.3516 L8.2168,41.7324 C8.2168,39.6816 6.6055,38.0703 4.5059,38.0703 C2.4551,38.0703 0.8438,39.6816 0.8438,41.7324 L0.8438,51.6445 Z"></path>
                </svg>
        }
        if (type === 'SEND')
        {
           icon =
               <svg {...defProps} width="103px" height="104px" viewBox="0 0 103 104">
                   <path fill="currentColor" d="M62.0938,103.2617 C65.6094,103.2617 68.0996,100.2344 69.9062,95.5469 L101.889,12.002 C102.768,9.7559 103.256,7.7539 103.256,6.0938 C103.256,2.9199 101.303,0.9668 98.129,0.9668 C96.469,0.9668 94.467,1.4551 92.221,2.334 L8.2363,34.5117 C4.1348,36.0742 0.96094,38.5645 0.96094,42.1289 C0.96094,46.6211 4.3789,48.1348 9.0664,49.5508 L35.4336,57.5586 C38.5586,58.5352 40.2676,58.4375 42.416,56.4844 L95.932,6.4355 C96.566,5.8496 97.299,5.9473 97.836,6.3867 C98.324,6.875 98.373,7.6074 97.787,8.2422 L47.8848,62.002 C46.0293,64.0039 45.8828,65.6641 46.8105,68.9355 L54.5742,94.7168 C56.0391,99.6484 57.5527,103.2617 62.0938,103.2617 Z"></path>
               </svg>
        }
        if (type === 'LAPTOP')
        {
            icon = <svg {...defProps} viewBox="0 0 21 18" width="21" height="18"><path fill="currentColor" d="M10.426 14.235a.767.767 0 0 1-.765-.765c0-.421.344-.765.765-.765s.765.344.765.765-.344.765-.765.765zM4.309 3.529h12.235v8.412H4.309V3.529zm12.235 9.942c.841 0 1.522-.688 1.522-1.529l.008-8.412c0-.842-.689-1.53-1.53-1.53H4.309c-.841 0-1.53.688-1.53 1.529v8.412c0 .841.688 1.529 1.529 1.529H1.25c0 .842.688 1.53 1.529 1.53h15.294c.841 0 1.529-.688 1.529-1.529h-3.058z"></path></svg>
        }
        if (type === 'ARROW_DOWN')
        {
            icon = <svg {...defProps} viewBox="0 0 21 21" width="21" height="21"><path fill="currentColor" d="M4.8 6.1l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path></svg>
        }
        if (type === 'MENU')
        {
            icon = <svg {...defProps}><path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
        }
        if (type === 'ARROW_RIGHT')
        {
            icon = <svg  {...defProps}><path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
        }
        if (type === 'PUSH')
        {
            icon = <svg  {...defProps}><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        }
        if (type === 'CLOSE_CIRCLE')
        {
            icon = <svg {...defProps} viewBox="0 0 35 35" width="35" height="35"><path fill="currentColor" d="M23.983 12.314l-1.297-1.297-5.186 5.186-5.186-5.186-1.297 1.297 5.187 5.186-5.187 5.186 1.297 1.297 5.186-5.186 5.187 5.186 1.297-1.297-5.187-5.186 5.186-5.186z"></path><path fill="currentColor" d="M17.5 34.75C7.988 34.75.25 27.012.25 17.5S7.988.25 17.5.25 34.75 7.988 34.75 17.5 27.012 34.75 17.5 34.75zm0-33.5C8.54 1.25 1.25 8.54 1.25 17.5S8.54 33.75 17.5 33.75s16.25-7.29 16.25-16.25S26.46 1.25 17.5 1.25z"></path></svg>
        }
        if (type === 'CLOSE_CHECK')
        {
            icon = <svg {...defProps} viewBox="0 0 35 35" width="35" height="35"><path fill="currentColor" d="M17.5 34.75C7.988 34.75.25 27.012.25 17.5S7.988.25 17.5.25 34.75 7.988 34.75 17.5 27.012 34.75 17.5 34.75zm0-33.5C8.54 1.25 1.25 8.54 1.25 17.5S8.54 33.75 17.5 33.75s16.25-7.29 16.25-16.25S26.46 1.25 17.5 1.25z"></path><path fill="currentColor" d="M14.3 21.4l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4-10.6 10.6z"></path></svg>
        }
        if (type === 'CIRCLE')
        {
            icon = <svg {...defProps}><circle fill="transparent" stroke="currentColor" cx="12" cy="12" r="11"></circle></svg>
        }
        if (type === 'ARROW_LEFT_TOP')
        {
            icon = <svg {...defProps} viewBox="0 0 35 35" width="35" height="35"><path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
        }
        if (type === 'SETTINGS')
        {
            icon = <svg  {...defProps} width="111px" height="110px" viewBox="0 0 111 110">
        <path fill="currentColor" d="M55.7207,102.5488 C56.9902,102.5488 58.2109,102.4023 59.5293,102.3047 L62.3125,107.6758 C62.8496,108.75 63.9238,109.3359 65.291,109.1406 C66.5117,108.8965 67.3418,108.0176 67.5371,106.6992 L68.3672,100.791 C70.8086,100.1562 73.2012,99.22852 75.4961,98.20312 L79.8906,102.1582 C80.8184,103.0371 81.9902,103.2324 83.2109,102.5488 C84.2852,101.9629 84.7246,100.791 84.4805,99.52148 L83.2598,93.66211 C85.3105,92.24609 87.3125,90.634766 89.1191,88.82812 L94.539,91.12305 C95.76,91.61133 96.932,91.36719 97.859,90.244141 C98.689,89.365234 98.787,88.0957 98.055,87.02148 L94.881,81.94336 C96.346,79.8926 97.518,77.6953 98.641,75.3516 L104.646,75.6445 C105.916,75.6934 106.941,75.0098 107.381,73.7891 C107.771,72.5684 107.43,71.3965 106.404,70.6152 L101.717,66.9043 C102.352,64.5605 102.84,62.0215 103.084,59.3848 L108.699,57.627 C109.969,57.1875 110.701,56.2598 110.701,54.9414 C110.701,53.6719 109.969,52.7441 108.699,52.3047 L103.084,50.498 C102.84,47.8613 102.352,45.4199 101.717,43.0273 L106.404,39.2676 C107.381,38.5352 107.771,37.4121 107.381,36.1914 C106.941,34.9707 105.916,34.2871 104.646,34.3359 L98.641,34.5801 C97.518,32.2363 96.346,30.0391 94.881,27.9883 L98.055,22.9102 C98.738,21.8848 98.641,20.6152 97.859,19.7363 C96.932,18.6133 95.76,18.3203 94.539,18.8574 L89.1191,21.0547 C87.3125,19.3457 85.3105,17.6855 83.2598,16.2695 L84.4805,10.459 C84.7246,9.1406 84.2852,7.9688 83.2109,7.3828 C81.9902,6.748 80.8184,6.8457 79.8906,7.8223 L75.4961,11.6797 C73.2012,10.6543 70.8086,9.8242 68.3672,9.1406 L67.5371,3.2324 C67.3418,1.9629 66.4629,1.0352 65.2422,0.8398 C63.9238,0.6445 62.8496,1.1816 62.3125,2.2559 L59.5293,7.627 C58.2109,7.5293 56.9902,7.4316 55.7207,7.4316 C54.4023,7.4316 53.2305,7.5293 51.9121,7.627 L49.0801,2.2559 C48.543,1.1816 47.4688,0.6445 46.1504,0.8398 C44.9297,1.0352 44.0508,1.9629 43.9043,3.2324 L43.0254,9.0918 C40.584,9.8242 38.2402,10.6543 35.8965,11.6797 L31.502,7.8223 C30.5742,6.8457 29.4023,6.748 28.1816,7.3828 C27.1074,7.9688 26.668,9.1406 26.9121,10.459 L28.1328,16.2695 C26.1309,17.6855 24.0801,19.3457 22.2734,21.0547 L16.8535,18.8574 C15.6328,18.3203 14.5098,18.6133 13.582,19.7363 C12.752,20.6152 12.6543,21.8848 13.3379,22.8613 L16.5117,27.9883 C15.0957,30.0391 13.875,32.2363 12.752,34.5801 L6.7949,34.3359 C5.5254,34.2871 4.4512,34.9707 4.0117,36.1914 C3.6211,37.4121 3.9629,38.5352 4.9883,39.2676 L9.6758,43.0273 C9.041,45.4199 8.5527,47.8613 8.4062,50.498 L2.6934,52.3047 C1.42383,52.6953 0.74023,53.623 0.74023,54.9414 C0.74023,56.2598 1.42383,57.1875 2.6934,57.627 L8.4062,59.4336 C8.5527,62.0215 9.041,64.5605 9.6758,66.9043 L4.9883,70.6152 C4.0117,71.3965 3.6699,72.5684 4.0117,73.7891 C4.4512,75.0098 5.5254,75.6934 6.7949,75.6445 L12.752,75.3516 C13.875,77.6953 15.0957,79.8926 16.5117,81.94336 L13.3379,87.02148 C12.6543,88.0957 12.752,89.365234 13.582,90.244141 C14.5098,91.36719 15.6328,91.61133 16.8535,91.12305 L22.2734,88.82812 C24.0801,90.634766 26.1309,92.24609 28.1328,93.66211 L26.9121,99.52148 C26.668,100.791 27.1074,101.9629 28.1816,102.5488 C29.4023,103.2324 30.5742,103.0371 31.502,102.1582 L35.8965,98.20312 C38.2402,99.22852 40.584,100.1562 43.0254,100.791 L43.9043,106.6992 C44.0508,108.0176 44.9297,108.8965 46.1504,109.1406 C47.4688,109.3359 48.543,108.75 49.0801,107.6758 L51.9121,102.3047 C53.1816,102.4023 54.4023,102.5488 55.7207,102.5488 Z M67.9766,51.8652 C65.7305,45.7129 61.1895,42.3438 55.623,42.3438 C54.7441,42.3438 53.8164,42.4414 52.2051,42.7832 L38.1914,18.8574 C43.4648,16.2695 49.373,14.8535 55.7207,14.8535 C77.0098,14.8535 93.709,31.0156 95.271,51.8652 L67.9766,51.8652 Z M16.0723,54.9902 C16.0723,41.416 22.5176,29.4531 32.5762,22.2266 L46.7363,46.2988 C44.0508,49.0332 42.8301,52.0117 42.8301,55.1855 C42.8301,58.2617 44.002,61.0938 46.6875,63.9258 L32.2832,87.55859 C22.3711,80.2832 16.0723,68.4668 16.0723,54.9902 Z M49.7637,55.1367 C49.7637,51.8164 52.5469,49.2285 55.7207,49.2285 C58.9922,49.2285 61.7266,51.8164 61.7266,55.1367 C61.7266,58.4082 58.9922,61.0938 55.7207,61.0938 C52.5469,61.0938 49.7637,58.4082 49.7637,55.1367 Z M55.7207,95.12695 C49.2266,95.12695 43.1719,93.61328 37.8496,90.976562 L52.2051,67.4902 C53.7188,67.8809 54.7441,67.9785 55.623,67.9785 C61.2383,67.9785 65.7793,64.5117 67.9766,58.2129 L95.223,58.2129 C93.66,78.9648 77.0098,95.12695 55.7207,95.12695 Z"></path>
        </svg>
        }
        if (type === 'BUBBLE')
        {
            icon = <svg {...defProps} width="108px" height="102px" viewBox="0 0 108 102">
                    <path fill="currentColor" d="M29.4551,101.7012 C31.3594,101.7012 32.7754,100.7246 35.0703,98.5762 L52.6973,82.462891 L85.7051,82.511719 C100.256,82.560547 108.068,74.45508 108.068,60.1484 L108.068,22.7461 C108.068,8.4395 100.256,0.3828 85.7051,0.3828 L22.8145,0.3828 C8.2637,0.3828 0.4512,8.3906 0.4512,22.7461 L0.4512,60.1484 C0.4512,74.50391 8.2637,82.511719 22.8145,82.462891 L25.1094,82.462891 L25.1094,96.6719 C25.1094,99.6992 26.6719,101.7012 29.4551,101.7012 Z M37.4629,43.4492 C37.4629,47.3066 34.0449,50.6758 30.1387,50.6758 C26.2324,50.6758 22.9121,47.3066 22.9121,43.4492 C22.9121,39.543 26.1348,36.125 30.1387,36.125 C34.0449,36.125 37.4629,39.5918 37.4629,43.4492 Z M61.8281,43.4492 C61.8281,47.3066 58.5078,50.6758 54.6016,50.6758 C50.6953,50.6758 47.375,47.3066 47.375,43.4492 C47.375,39.543 50.6465,36.125 54.6016,36.125 C58.5078,36.125 61.8281,39.5918 61.8281,43.4492 Z M86.291,43.4492 C86.291,47.3066 83.0195,50.6758 79.0645,50.6758 C75.1582,50.6758 71.7891,47.3066 71.7891,43.4492 C71.7891,39.543 75.1094,36.125 79.0645,36.125 C83.0195,36.125 86.291,39.5918 86.291,43.4492 Z"></path>
                </svg>
        }
        if (type === 'BACK')
        {
            icon = <svg {...defProps} width="49px" height="86px" viewBox="0 0 49 86">
                <path fill="currentColor" d="M40.5879,83.81055 C41.418,84.64062 42.4922,85.12891 43.7617,85.12891 C46.3008,85.12891 48.2051,83.22461 48.2051,80.68555 C48.2051,79.46484 47.7168,78.341797 46.9355,77.511719 L11.3887,42.7461 L46.9355,7.9805 C47.7168,7.1504 48.2051,5.9785 48.2051,4.8066 C48.2051,2.2676 46.3008,0.3145 43.7617,0.3145 C42.4922,0.3145 41.418,0.8027 40.5879,1.6328 L1.916,39.4746 C0.9883,40.2559 0.4512,41.4766 0.4512,42.7461 C0.4512,43.9668 0.9395,45.0898 1.8672,46.0176 L40.5879,83.81055 Z"></path>
            </svg>
        }
        if (type === 'PLUS')
        {
            icon = <svg {...defProps} width="82px" height="83px" viewBox="0 0 82 83">
                <path fill="currentColor" d="M40.7344,82.9082 C43.127,82.9082 45.1289,81.00391 45.1289,78.66016 L45.1289,46.1895 L76.6719,46.1895 C79.0156,46.1895 81.0176,44.1875 81.0176,41.7949 C81.0176,39.4023 79.0156,37.4492 76.6719,37.4492 L45.1289,37.4492 L45.1289,4.9297 C45.1289,2.5859 43.127,0.6816 40.7344,0.6816 C38.3418,0.6816 36.3887,2.5859 36.3887,4.9297 L36.3887,37.4492 L4.7969,37.4492 C2.4531,37.4492 0.4512,39.4023 0.4512,41.7949 C0.4512,44.1875 2.4531,46.1895 4.7969,46.1895 L36.3887,46.1895 L36.3887,78.66016 C36.3887,81.00391 38.3418,82.9082 40.7344,82.9082 Z"></path>
            </svg>
        }
        if (type === 'DOCUMENT')
        {
            icon = <svg {...defProps} height="512" viewBox="0 0 128 128" width="512"><path fill="currentColor" d="m107.812 14.836h-8.53v-8.529a1.749 1.749 0 0 0 -1.75-1.75h-56.585a1.7 1.7 0 0 0 -.337.034h-.01a1.758 1.758 0 0 0 -.433.154c-.03.015-.058.031-.088.048a1.754 1.754 0 0 0 -.377.279l-20.749 20.755a1.708 1.708 0 0 0 -.278.374c-.018.031-.035.061-.051.093a1.793 1.793 0 0 0 -.152.427v.023a1.715 1.715 0 0 0 -.033.322v84.348a1.75 1.75 0 0 0 1.75 1.75h8.531v8.529a1.749 1.749 0 0 0 1.75 1.75h77.344a1.749 1.749 0 0 0 1.75-1.75v-105.107a1.749 1.749 0 0 0 -1.752-1.75zm-68.612-4.305v14.785h-14.788zm-17.263 18.285h19.01a1.749 1.749 0 0 0 1.75-1.75v-2.713h38.913a1.75 1.75 0 0 0 0-3.5h-38.91v-12.796h53.082v101.607h-73.845zm84.125 91.127h-73.844v-6.779h65.314a1.749 1.749 0 0 0 1.75-1.75v-93.078h6.78z"/><path d="m36.109 48.524h45.5a1.75 1.75 0 1 0 0-3.5h-45.5a1.75 1.75 0 0 0 0 3.5z"/><path d="m36.109 60.61h45.5a1.75 1.75 0 0 0 0-3.5h-45.5a1.75 1.75 0 1 0 0 3.5z"/><path d="m36.109 72.7h45.5a1.75 1.75 0 0 0 0-3.5h-45.5a1.75 1.75 0 0 0 0 3.5z"/><path fill="currentColor" d="m36.109 84.781h45.5a1.75 1.75 0 1 0 0-3.5h-45.5a1.75 1.75 0 0 0 0 3.5z"/><path fill="currentColor" d="m36.109 96.867h45.5a1.75 1.75 0 0 0 0-3.5h-45.5a1.75 1.75 0 1 0 0 3.5z"/><path fill="currentColor" d="m36.109 36.438h45.5a1.75 1.75 0 0 0 0-3.5h-45.5a1.75 1.75 0 1 0 0 3.5z"/></svg>
        }
        if (type === 'LOCATION')
        {
            icon = <svg {...defProps} width="100px" height="100px" viewBox="0 0 100 100">
                <path fill="currentColor" d="M8.8691,52.6035 L45.832,52.75 C46.5156,52.75 46.8574,53.043 46.8574,53.7754 L46.9551,90.64062 C46.9551,95.2793 49.0059,99.0879 52.8633,99.0879 C56.5742,99.0879 58.5762,95.6211 60.334,91.76367 L97.736,11.1973 C98.664,9.293 99.104,7.584 99.104,6.168 C99.104,2.9453 96.711,0.5039 93.439,0.5039 C91.9746,0.5039 90.2656,0.8945 88.3613,1.8223 L7.7949,39.1758 C4.084,40.8848 0.4707,42.9355 0.4707,46.6953 C0.4707,50.4551 4.084,52.6035 8.8691,52.6035 Z"></path>
            </svg>
        }
        if (type === 'CLOSE')
        {
            icon = <svg {...defProps}><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg>
        }
        if (type === 'INSTALL')
        {
            icon = <svg {...defProps} viewBox="0 0 1024 1024">
                <path fill="currentColor" d="M56.888889 284.444444h853.333333v682.666667H56.888889V284.444444z m56.888889 56.888889v568.888889h739.555555V341.333333H113.777778zM199.111111 170.666667L125.155556 284.444444H56.888889l113.777778-170.666666h625.777777l113.777778 170.666666h-68.266666l-73.955556-113.777777h-568.888889zM125.155556 284.444444H56.888889l113.777778-170.666666h625.777777l113.777778 170.666666h-68.266666l-73.955556-113.777777h-568.888889L125.155556 284.444444z"/>
                <path fill="currentColor" d="M227.555556 603.022222l39.822222-34.133333 221.866666 193.422222 216.177778-193.422222 39.822222 34.133333-256 227.555556z"/>
                <path fill="currentColor" d="M455.111111 398.222222h56.888889v369.777778H455.111111z"/>
            </svg>
        }
        if (type === 'PHOTO')
        {
            icon = <svg {...defProps} viewBox="0 0 16 20" width="16" height="20"><path fill="currentColor" d="M13.822 4.668H7.14l-1.068-1.09a1.068 1.068 0 0 0-.663-.278H3.531c-.214 0-.51.128-.656.285L1.276 5.296c-.146.157-.266.46-.266.675v1.06l-.001.003v6.983c0 .646.524 1.17 1.17 1.17h11.643a1.17 1.17 0 0 0 1.17-1.17v-8.18a1.17 1.17 0 0 0-1.17-1.169zm-5.982 8.63a3.395 3.395 0 1 1 0-6.79 3.395 3.395 0 0 1 0 6.79zm0-5.787a2.392 2.392 0 1 0 0 4.784 2.392 2.392 0 0 0 0-4.784z"></path></svg>
        }
        if (type === 'PHOTO')
        {
            icon = <svg {...defProps} viewBox="0 0 13 20" width="13" height="20"><path fill="currentColor" d="M10.2 3H2.5C1.7 3 1 3.7 1 4.5v10.1c0 .7.7 1.4 1.5 1.4h7.7c.8 0 1.5-.7 1.5-1.5v-10C11.6 3.7 11 3 10.2 3zm-2.6 9.7H3.5v-1.3h4.1v1.3zM9.3 10H3.5V8.7h5.8V10zm0-2.7H3.5V6h5.8v1.3z"></path></svg>
        }
        if (type === 'VIDEO')
        {
            icon = <svg {...defProps} viewBox="0 0 16 20" width="16" height="20"><path fill="currentColor" d="M15.243 5.868l-3.48 3.091v-2.27c0-.657-.532-1.189-1.189-1.189H1.945c-.657 0-1.189.532-1.189 1.189v7.138c0 .657.532 1.189 1.189 1.189h8.629c.657 0 1.189-.532 1.189-1.189v-2.299l3.48 3.09v-8.75z"></path></svg>
        }
        if (type === 'CLOCK')
        {
            icon = <svg {...defProps} viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"></path></svg>
        }
        if (type === 'INFO')
        {
            icon = <svg {...defProps} viewBox="0 0 20 20"><path fill="currentColor" d="M9.5 16A6.61 6.61 0 0 1 3 9.5 6.61 6.61 0 0 1 9.5 3 6.61 6.61 0 0 1 16 9.5 6.63 6.63 0 0 1 9.5 16zm0-14A7.5 7.5 0 1 0 17 9.5 7.5 7.5 0 0 0 9.5 2zm.5 6v4.08h1V13H8.07v-.92H9V9H8V8zM9 6h1v1H9z"></path></svg>
        }
        if (type === 'RELOAD')
        {
            icon = <svg {...defProps} viewBox="0 0 20 20"><path fill="currentColor" d="M15.65 4.35A8 8 0 1 0 17.4 13h-2.22a6 6 0 1 1-1-7.22L11 9h7V2z"></path></svg>
        }
        if (type === 'SHARE')
        {
            icon = <svg {...defProps} viewBox="0 0 507.45 507.45"> <path fill="currentColor"  d="M408,178.5c-20.4,0-38.25,7.65-51,20.4L175.95,94.35c2.55-5.1,2.55-12.75,2.55-17.85C178.5,33.15,145.35,0,102,0
			S25.5,33.15,25.5,76.5S58.65,153,102,153c20.4,0,38.25-7.65,51-20.4l181.05,104.55c-2.55,5.1-2.55,12.75-2.55,17.85
			c0,5.1,0,12.75,2.55,17.85L153,379.95c-12.75-12.75-30.6-20.4-51-20.4c-40.8,0-73.95,33.15-73.95,73.95S61.2,507.45,102,507.45
			s73.95-33.15,73.95-73.95c0-5.1,0-10.2-2.55-17.85L354.45,308.55c12.75,12.75,30.6,20.4,51,20.4c43.35,0,76.5-33.15,76.5-76.5
			C481.95,209.1,451.35,178.5,408,178.5z"/></svg>
        }
        if (type === 'FACEID')
        {
            let style = {strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10};
            icon = <svg {...defProps} viewBox="0 0 30 30">
                <path style={style} fill="currentColor" d="M12.062,20c0.688,0.5,1.688,1,2.938,1s2.25-0.5,2.938-1"/>
                <line style={style} stroke="currentColor" x1="20" x2="20" y1="12" y2="14"/>
                <line style={style} stroke="currentColor" x1="10" x2="10" y1="12" y2="14"/>
                <path style={style} fill="currentColor" d="M15,12  v4c0,0.552-0.448,1-1,1"/>
            <g>
                <path style={style} fill="currentColor" d="M26,9   V6c0-1.105-0.895-2-2-2h-3"/>
                <path style={style} fill="currentColor" d="M9,4   H6C4.895,4,4,4.895,4,6v3"/>
                <path style={style} fill="currentColor" d="   M21,26h3c1.105,0,2-0.895,2-2v-3"/>
                <path style={style} fill="currentColor" d="M4,21   v3c0,1.105,0.895,2,2,2h3"/>
            </g>
            </svg>
        }
        if (type === 'SIGNOUT')
        {
            icon = <svg {...defProps}  width="98px" height="102px" viewBox="0 0 98 102">
                    <path d="M49.2754,52.2578 C51.6191,52.2578 53.2305,50.5488 53.2305,48.1074 L53.2305,4.2598 C53.2305,1.7695 51.6191,0.1094 49.2754,0.1094 C46.9316,0.1094 45.3691,1.7695 45.3691,4.2598 L45.3691,48.1074 C45.3691,50.5488 46.9316,52.2578 49.2754,52.2578 Z M49.2754,101.2324 C75.7891,101.2324 97.811,79.25977 97.811,52.7461 C97.811,38.3418 91.3164,25.2559 81.1113,16.3691 C77.1074,12.7559 71.2969,18.4688 75.8867,22.5215 C84.2363,29.7969 89.5098,40.6855 89.5098,52.7461 C89.5098,75.0605 71.5898,92.98047 49.2754,92.98047 C26.9609,92.98047 9.0898,75.0605 9.0898,52.7461 C9.0898,40.6855 14.3145,29.8457 22.6641,22.5215 C27.3027,18.4688 21.4434,12.7559 17.4395,16.3691 C7.2344,25.2559 0.74023,38.3418 0.74023,52.7461 C0.74023,79.25977 22.7617,101.2324 49.2754,101.2324 Z"></path>
                </svg>
        }
        if (type === 'THEME')
        {
            icon = <svg {...defProps}><path d="M12 1l3.22 3.22h4.56v4.56L23 12l-3.22 3.22v4.56h-4.56L12 23l-3.22-3.22H4.22v-4.56L1 12l3.22-3.22V4.22h4.56L12 1zm0 5v12c3.31 0 6-2.69 6-6a6.005 6.005 0 0 0-5.775-5.996L12 6z" fill="currentColor"></path></svg>
        }
        if (type === 'MOTION')
        {
            icon = <svg {...defProps} viewBox="0 0 1024 1024"><path fill="currentColor" d="M541.573125 625.77664H86.456325A85.42208 85.42208 0 0 0 1.126405 711.10656v227.56352A85.42208 85.42208 0 0 0 86.456325 1024h455.1168a85.42208 85.42208 0 0 0 85.32992-85.32992V711.10656a85.42208 85.42208 0 0 0-85.32992-85.32992z m28.44672 312.89344a28.4672 28.4672 0 0 1-28.44672 28.44672H86.456325a28.4672 28.4672 0 0 1-28.44672-28.44672V711.10656a28.4672 28.4672 0 0 1 28.44672-28.44672h455.1168a28.4672 28.4672 0 0 1 28.44672 28.44672zM927.744005 446.58688a28.4672 28.4672 0 0 0-39.8336 5.66272l-62.91456 83.80416a28.449792 28.449792 0 0 0 45.49632 34.17088l24.576-32.768a285.94176 285.94176 0 0 1-200.2944 302.8992 28.448768 28.448768 0 0 0 16.72192 54.38464c157.50144-48.46592 254.976-200.81664 240.50688-358.78912L977.346565 555.008a28.449792 28.449792 0 0 0 34.17088-45.49632zM937.543685 0H482.426885a85.42208 85.42208 0 0 0-85.32992 85.32992v227.56352a85.42208 85.42208 0 0 0 85.32992 85.32992h455.1168a85.42208 85.42208 0 0 0 85.32992-85.32992V85.32992A85.42208 85.42208 0 0 0 937.543685 0z m28.44672 312.89344a28.4672 28.4672 0 0 1-28.44672 28.44672H482.426885a28.4672 28.4672 0 0 1-28.44672-28.44672V85.32992a28.4672 28.4672 0 0 1 28.44672-28.44672h455.1168a28.4672 28.4672 0 0 1 28.44672 28.44672zM96.256005 577.41312a28.50816 28.50816 0 0 0 17.08032 5.69344 27.648 27.648 0 0 0 4.00384-0.27648 28.55936 28.55936 0 0 0 18.74944-11.07968l62.88384-83.80416a28.449792 28.449792 0 1 0-45.49632-34.17088l-24.576 32.768a286.0032 286.0032 0 0 1 200.33536-302.90944 28.448768 28.448768 0 0 0-16.72192-54.38464c-157.52192 48.4864-254.976 200.8064-240.5376 358.76864L46.653445 468.992a28.449792 28.449792 0 0 0-34.17088 45.49632z"/></svg>
        }
        if (type === 'IOS_SHARE')
        {
            icon = <svg {...defProps} viewBox="0 0 1000 1000"><path fill="currentColor" d="M780,290H640v35h140c19.3,0,35,15.7,35,35v560c0,19.3-15.7,35-35,35H220c-19.2,0-35-15.7-35-35V360c0-19.2,15.7-35,35-35h140v-35H220c-38.7,0-70,31.3-70,70v560c0,38.7,31.3,70,70,70h560c38.7,0,70-31.3,70-70V360C850,321.3,818.7,290,780,290z M372.5,180l110-110.2v552.7c0,9.6,7.9,17.5,17.5,17.5c9.6,0,17.5-7.9,17.5-17.5V69.8l110,110c3.5,3.5,7.9,5,12.5,5s9-1.7,12.5-5c6.8-6.8,6.8-17.9,0-24.7l-140-140c-6.8-6.8-17.9-6.8-24.7,0l-140,140c-6.8,6.8-6.8,17.9,0,24.7C354.5,186.8,365.5,186.8,372.5,180z"/></svg>
        }
        if (type === 'USER')
        {
            icon = <svg {...defProps} viewBox="0 0 512 512"><path fill="currentColor" d="M454.426,392.582c-5.439-16.32-15.298-32.782-29.839-42.362c-27.979-18.572-60.578-28.479-92.099-39.085  c-7.604-2.664-15.33-5.568-22.279-9.7c-6.204-3.686-8.533-11.246-9.974-17.886c-0.636-3.512-1.026-7.116-1.228-10.661  c22.857-31.267,38.019-82.295,38.019-124.136c0-65.298-36.896-83.495-82.402-83.495c-45.515,0-82.403,18.17-82.403,83.468  c0,43.338,16.255,96.5,40.489,127.383c-0.221,2.438-0.511,4.876-0.95,7.303c-1.444,6.639-3.77,14.058-9.97,17.743  c-6.957,4.133-14.682,6.756-22.287,9.42c-31.521,10.605-64.119,19.957-92.091,38.529c-14.549,9.58-24.403,27.159-29.838,43.479  c-5.597,16.938-7.886,37.917-7.541,54.917h205.958h205.974C462.313,430.5,460.019,409.521,454.426,392.582z"/></svg>
        }
        if (type === 'NEW_CHAT')
        {
            icon =
                <svg {...defProps} width="112px" height="114px" viewBox="0 0 112 114">
                    <g stroke="none" fill="currentColor">
                        <g transform="translate(0.310383, 0.000000)" fill="currentColor">
                            <path d="M44.7521171,58.3821252 L93.2091483,9.92509392 L101.060711,17.7766564 L52.6036796,66.2336877 C48.0709377,68.2356679 44.3345387,69.830121 41.3944826,71.0170472 C39.9163641,71.0170472 39.6692777,69.9483356 39.6692777,69.236658 C40.8936011,66.5889343 42.5878809,62.9707567 44.7521171,58.3821252 Z" id="PenBody"></path>
                            <path d="M102.156623,0.925305975 C104.985861,-0.391390529 105.926105,-0.539249018 108.739425,2.05456803 C111.530708,4.62806631 111.163272,6.32280909 109.995709,8.72742791 C109.158187,9.52587192 107.547041,11.1946252 105.162273,13.7336877 L97.2521171,5.76493767 C99.4612482,3.57768051 101.096084,1.96446994 102.156623,0.925305975 Z" id="PenTop"></path>
                            <path d="M75.269,13.7336877 L65.226,23.7766877 L17.6922279,23.7775225 C13.9247395,23.7775225 10.8488027,26.7549076 10.6980163,30.4910287 L10.6923857,30.7305136 L10.256474,95.6397842 L10.2563162,95.6867931 C10.2563162,99.4722448 13.2610995,102.555892 17.0156664,102.682734 L17.2563162,102.686793 L82.7202116,102.686793 C86.5056633,102.686793 89.5893103,99.6820097 89.7161526,95.9274428 L89.7202116,95.6867931 L89.72,43.1226877 L99.42,33.4226877 L99.4200858,97.3529771 C99.4200858,106.189533 92.2566418,113.352977 83.4200858,113.352977 L16.5581063,113.352977 C7.77307614,113.352977 0.631155866,106.269759 0.558651232,97.4850284 L0.000556529437,29.8657389 C-0.0723733574,21.0294839 7.03170532,13.8071625 15.8679604,13.7342326 L75.269,13.7336877 Z" id="Combined-Shape"></path>
                        </g>
                    </g>
                </svg>
        }
        return icon;
    };
}
