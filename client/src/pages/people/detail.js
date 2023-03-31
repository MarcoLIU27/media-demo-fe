<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.1.2/echarts.min.js"></script>

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom"
import ReactEcharts from 'echarts-for-react'; // 导入ReactEcharts模块
import axios from "axios";
import * as echarts from 'echarts'
import SearchBox from "../components/search";


  
function PeopleDetail() {
    const { encodedParentName } = useParams();
    //const [parentName, setParentName] = useState('');
    const [parentPresent, setparentPresent] = useState('');
    const [shortBio, setShortBio] = useState('');
    const [wikiLongBio, setwikiLongBio] = useState('');
    const [baiduLongBio, setbaiduLongBio] = useState('');
    const [currentBlock, setCurrentBlock] = useState('all'); // 添加状态变量
    // const [chartOption, setChartOption] = useState({}); // 添加状态变量
    const [parentName1, setparentName1] = useState('');
    const [parentPresent1, setparentPresent1] = useState('');
    const [parentName2, setparentName2] = useState('');
    const [parentPresent2, setparentPresent2] = useState('');
    const [parentName3, setparentName3] = useState('');
    const [parentPresent3, setparentPresent3] = useState('');
    const [parentName4, setparentName4] = useState('');
    const [parentPresent4, setparentPresent4] = useState('');
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [count, setCount] = useState(0);
    var myChart = null;
    var option = {};

    useEffect(() => {
        myChart = echarts.init(document.getElementById('chart'));
        // 在这里使用 myChart 对象绘制图表
        return () => {
          myChart.dispose();
        };
      }, []);

    function rawDataTochartData(encodedParentName, block) {
        return new Promise((resolve, reject) => {
            const data = [];
            fetch(`https://media-demo.onrender.com/api/people/${encodedParentName}/rankingIndex/${block}`)
                .then(response => response.json())
                .then(result => {
                    // 将查询结果格式化成 ECharts 所需的数据格式
                    result.forEach(item => {
                        data.push({ year: item.year, ranking_index: item.ranking_index });
                    });
                
                    //console.log(data);

                    // 找出最小年份和最大年份
                    const minYear = 2012;
                    const maxYear = 2022;
                    
                    // 创建年份范围数组
                    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => i + minYear);
                    
                    // 插入数据到年份范围数组中
                    const yearData = data.reduce((acc, item) => {
                        acc[item.year] = item.ranking_index;
                        return acc;
                    }, {});
                    
                    const chartData = years.map(year => {
                        const rankingIndex = yearData[year] || null;
                        return { year, rankingIndex };
                    });
        
                    // 返回 用于 ECharts 的 data
                    resolve(chartData);
                })
                .catch(error => reject(error));
        });
    }

    async function generateChartOption(block) {
        console.log("generateChartOption");
        console.log(block);
        const chartData = await rawDataTochartData(encodedParentName, block);
        console.log(chartData);
        
        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('chart'));

        // 生成 ECharts 的初始配置
        option = {

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [parentPresent]
            },
            xAxis: {
                type: 'category',
                data: chartData.map(item => item.year),
                boundaryGap: false,
                position: 'top',
                axisLine: {
                    onZero: false,
                },
            },
            yAxis: {
                type: 'value',
                inverse : true,
                axisLine: {
                    onZero: false,
                },
                min: chartData.length > 0 ? null : 0, // 只有当数据不为空时，最小值为 null，否则为 0
                max: chartData.length > 0 ? null : 1000, // 只有当数据不为空时，最大值为 null，否则为 1000
                splitNumber: chartData.length > 0 ? null : 5, // 只有当数据不为空时，分割数为 null，否则为 10
            },
            series: [
                {
                    name: parentPresent,
                    type: 'line',
                    data: chartData.map(item => item.rankingIndex),
                    itemStyle: { normal: { label: { show: true } } },
                },
            ],

        };

        if (parentName1) {
            const encodedParentName1 = encodeURIComponent(parentName1);
            const chartData1 = await rawDataTochartData(encodedParentName1, block)
            console.log(chartData1); 
            addChartData(parentPresent1, chartData1); // add new data to option 更新option
        }
        if (parentName2) {
            const encodedParentName2 = encodeURIComponent(parentName2);
            const chartData2 = await rawDataTochartData(encodedParentName2, block)
            console.log(chartData2); 
            addChartData(parentPresent2, chartData2); // add new data to option 更新option
        }
        if (parentName3) {
            const encodedParentName3 = encodeURIComponent(parentName3);
            const chartData3 = await rawDataTochartData(encodedParentName3, block)
            console.log(chartData3); 
            addChartData(parentPresent3, chartData3); // add new data to option 更新option
        }
        if (parentName4) {
            const encodedParentName4 = encodeURIComponent(parentName4);
            const chartData4 = await rawDataTochartData(encodedParentName4, block)
            console.log(chartData4); 
            addChartData(parentPresent4, chartData4); // add new data to option 更新option
        }

        console.log(myChart)
        
        myChart.setOption(option); //刷新ECharts
        
    }

    function addChartData(newparentPresent, newData) {

        option.series.push({
            name: newparentPresent,
            type: 'line',
            data: newData.map(item => item.rankingIndex),
            itemStyle: { normal: { label: { show: true } } }
        });
        option.legend.data.push(newparentPresent);
               
    }

    
    const handleSelected1  = (parentName, parentPresent) => {
        setparentName1(parentName);
        setparentPresent1(parentPresent);
    };
    const handleSelected2  = (parentName, parentPresent) => {
        setparentName2(parentName);
        setparentPresent2(parentPresent);
    };
    const handleSelected3  = (parentName, parentPresent) => {
        setparentName3(parentName);
        setparentPresent3(parentPresent);
    };
    const handleSelected4  = (parentName, parentPresent) => {
        setparentName4(parentName);
        setparentPresent4(parentPresent);
    };

    useEffect(() => {
        if (parentName1) {
            // 点击按钮更新图表数据
            console.log('parentName added');
            console.log(parentName1)
            generateChartOption(currentBlock); //刷新ECharts
        }
    }, [parentName1]);

    useEffect(() => {
        if (parentName2) {
            // 点击按钮更新图表数据
            console.log('parentName added');
            console.log(parentName2)
            generateChartOption(currentBlock); //刷新ECharts
        }
    }, [parentName2]);

    useEffect(() => {
        if (parentName3) {
            // 点击按钮更新图表数据
            console.log('parentName added');
            console.log(parentName3)
            generateChartOption(currentBlock); //刷新ECharts
        }
    }, [parentName3]);

    useEffect(() => {
        if (parentName4) {
            // 点击按钮更新图表数据
            console.log('parentName added');
            console.log(parentName4)
            generateChartOption(currentBlock); //刷新ECharts
        }
    }, [parentName4]);

    // 根据选定的 block 分类生成 ECharts 的配置
    useEffect(() => {
        if (currentBlock) {
            console.log('block changed');
            generateChartOption(currentBlock); //刷新ECharts

        }
    }, [currentBlock]);


    useEffect(() => {
    async function fetchData() {
        try {
        const response = await fetch(`https://media-demo.onrender.com/api/people/${encodedParentName}`);
        const { parent_name, parent_present, short_bio, wiki_long_bio, baidu_long_bio } = await response.json();
        //setParentName(parent_name);
        setparentPresent(parent_present);
        console.log("set parent present here");
        setShortBio(short_bio);
        setwikiLongBio(wiki_long_bio);
        setbaiduLongBio(baidu_long_bio);
        } catch (error) {
        console.error(error);
        }
    }
    fetchData();
    }, [encodedParentName]);

    const handleAddSearchBox = () => {
        if (count < 4) {
          setShowSearchBox(true);
          setCount(count + 1);
        }
    };
    
    return (
    <div>
        <h1>{parentPresent}</h1>
        <p>{shortBio}</p>
        <h3>指数排名</h3>
        <div style={{ width: '100%'}}>
            <button onClick={handleAddSearchBox} class="add-searchbox-btn">添加对比</button>
            <div className="grid-container">
                {showSearchBox && <SearchBox onSelected={handleSelected1} />} 
                {count > 1 && showSearchBox && <SearchBox onSelected={handleSelected2} />}
                {count > 2 && showSearchBox && <SearchBox onSelected={handleSelected3} />}
                {count > 3 && showSearchBox && <SearchBox onSelected={handleSelected4} />}         
            </div>
            <p>选择媒体来源：</p>
            <select value={currentBlock} className="my-select" onChange={(event) => setCurrentBlock(event.target.value)}>
                <option value="all">All</option>
                <option value="财新周刊">财新周刊</option>
                <option value="观察">观察</option>
                <option value="环球时报">环球时报</option>
                <option value="南方都市报">南方都市报</option>
                <option value="南方周末">南方周末</option>
                <option value="澎湃新闻">澎湃新闻</option>
                <option value="人民日报">人民日报</option>
                <option value="新京报">新京报</option>
                <option value="中国青年报">中国青年报</option>
            </select>
            <div style={{ width: '80%', marginLeft: '10%' }} >
                <div id="chart" style={{ width: '80%', marginLeft: '10%', height: 500 }}></div>
            </div>
        </div>
        <h3>维基百科</h3>
        <p>{wikiLongBio}</p>
        <h3>百度百科</h3>
        <p>{baiduLongBio}</p>
    </div>
    );
}

export default PeopleDetail;
