import React from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';
import { loremIpsum } from 'lorem-ipsum';

const total = 1000;
// 每次加载的数量要大于一屏显示的数量 + 预渲染的数量
const rowCount = 40;
// 高度计算不精确也可以通过调整 InfiniteLoader 的 threshold 值解决
let list = Array(rowCount).fill().map(() => {
	return loremIpsum({
		count: 1, // 单词、句子或段落的数量
		units: 'sentences', // word(单词)、sentence(段落)、paragraph(句子)
		sentenceLowerBound: 3, // 每句话的最小字数
		sentenceUpperBound: 3 // 每句话的最大字数
	});
});

// 使每一列自适应
const cache = new CellMeasurerCache({ defaultHeight: 30, fixedWidth: true });

function rowRenderer({
	index, // 数组的索引
	key, // 唯一 key
	parent, // 对父列表实例的引用
	style // 应用到行列表的样式，用于定位
}) {
	let item = list[index];
	// 注意这里不应直接把 item 换成 loading...，因为可能加载出来的数据不止一行，会出现计算错误
	if (!item) {
		return null;
	}
	return (
		<CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
			<div style={style} className="news-item">
				{item}
			</div>
		</CellMeasurer>
	);
}

function isRowLoaded({ index }) {
	return !!list[index];
}

function loadMoreRows({ startIndex, stopIndex }) {
    let temList = Array(rowCount).fill().map(() => {
        return loremIpsum({
            count: 1, // 单词、句子或段落的数量
            units: 'sentences', // word(单词)、sentence(段落)、paragraph(句子)
            sentenceLowerBound: 3, // 每句话的最小字数
            sentenceUpperBound: 3 // 每句话的最大字数
        });
    });
    list = list.concat(temList);
    // 后面可以改成真实的数据
    return Promise.resolve();
}

export default class NewsList extends React.Component {
    state = {
        list: [],
        isLoading: true
    }
    getList = () => {
        
    }
	render() {
		return (
			<InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={total}>
				{({ onRowsRendered, registerChild }) =>
					<AutoSizer>
						{({ height, width }) =>
							<List
								width={width}
								height={height}
								ref={registerChild}
								rowCount={total}
								rowHeight={cache.rowHeight}
								onRowsRendered={onRowsRendered}
								rowRenderer={rowRenderer}
								deferredMeasurementCache={cache}
							/>}
					</AutoSizer>}
			</InfiniteLoader>
		);
	}
}
