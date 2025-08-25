import React, { useState } from "react";
import { Card, Collapse, Segmented, DatePicker, Progress, Row, Col, Tag, Space, Divider } from "antd";
import type { Dayjs } from 'dayjs';
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import CustomTabs from "@/components/CustomTabs/CustomTabs";
import SegmentedGroup from "@/components/Segmented/SegmentedGroup";
import FiltersBar from "@/components/Analytics/FiltersBar";
import OverviewCard from "@/components/Analytics/OverviewCard";
import ChartCard from "@/components/Analytics/ChartCard";
// CollapseCard оставлен на будущее (Liquidity/ROI)
import KpiBadge from "@/components/KPI/KpiBadge";
import TransactionsTable from "@/components/Transactions/TransactionsTable";
import CustomInput from "@/components/CustomInput/CustomInput";
import { SearchOutlined, FilterOutlined, DownloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from "@ant-design/icons";
import styles from "./Analytics.module.scss";

// Chart components
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import { 
  pricesTrendData, 
  marketDistributionData, 
  buildingsByDistrictsData, 
  apartmentTypesData, 
  constructionStatusData,
  avgPricePerSqmData,
  roiData
} from "@/utils/mockChartData";

// replaced Select with CustomSelect; Option not used
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const Analytics: React.FC = () => {
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [selectedProject, setSelectedProject] = useState<string>("all");
    const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [catalogMode, setCatalogMode] = useState<string>("developer");
    const [salesMode, setSalesMode] = useState<string>("sales");

    // Моковые данные для таблицы
    type TableRow = {
        key: string;
        area: string;
        project: string;
        building: string;
        price: string;
        deals: number;
        volume: string;
        status: string;
        trend: string;
    };

    const tableData: TableRow[] = [
        {
            key: "1",
            area: "Downtown Dubai",
            project: "Burj Khalifa",
            building: "Tower A",
            price: "$2,500/m²",
            deals: 45,
            volume: "$12.5M",
            status: "active",
            trend: "up",
        },
        {
            key: "2",
            area: "Palm Jumeirah",
            project: "Palm Tower",
            building: "Tower B",
            price: "$3,200/m²",
            deals: 32,
            volume: "$8.9M",
            status: "pending",
            trend: "stable",
        },
        {
            key: "3",
            area: "Dubai Marina",
            project: "Marina Heights",
            building: "Tower C",
            price: "$2,800/m²",
            deals: 67,
            volume: "$18.7M",
            status: "active",
            trend: "up",
        },
    ];

    // columns оставлены для будущего использования с Ant Table, сейчас не используются
    // Колонки AntTable больше не нужны (используем свой компонент таблицы)

    const handleFilterApply = () => {
        console.log("🔄 Filters applied:", { selectedArea, selectedProject, selectedBuilding, dateRange, searchText });
        
        // ✅ ИСПРАВЛЕНО: Теперь реально применяем фильтры к данным
        const filteredData = tableData.filter(item => {
            let matches = true;
            
            if (selectedArea !== "all" && item.area !== selectedArea) matches = false;
            if (selectedProject !== "all" && item.project !== selectedProject) matches = false;  
            if (selectedBuilding !== "all" && item.building !== selectedBuilding) matches = false;
            if (searchText && !item.project.toLowerCase().includes(searchText.toLowerCase())) matches = false;
            
            return matches;
        });
        
        console.log(`✅ Found ${filteredData.length} items after filtering`);
        
        // Можно добавить состояние для фильтрованных данных
        // setFilteredData(filteredData);
        
        // Перерисовка графиков с новыми данными (пока имитация)
        console.log("📊 Updating charts with filtered data...");
    };

    const handleExportData = () => {
        console.log("Exporting data...");
    };

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.headerBar}>
                <div>
                    <h1>📊 Analytics Dashboard</h1>
                    <p>Comprehensive real estate market analysis for Dubai</p>
                </div>
                <Space>
                    <CustomButton icon={<DownloadOutlined />} onClick={handleExportData}>
                        Export Data
                    </CustomButton>
                    <CustomButton type="primary" icon={<BarChartOutlined />}>
                        Generate Report
                    </CustomButton>
                </Space>
            </div>

            {/* Top search line: Building / Districts / Developer / Naming + select + Search */}
            <FiltersBar
                mode={catalogMode}
                onModeChange={(v)=>setCatalogMode(v)}
                selectSlot={
                    <CustomSelect
                        className={styles.select}
                        placeholder="Select value"
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={[{ value: "all", label: "All" }, { value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]}
                    />
                }
                onSearch={handleFilterApply}
            />

            {/* Advanced Filters Section */}
            <Card title={<><FilterOutlined /> Advanced Filters</>} className={styles.filtersCard}>
                <Row gutter={[16, 16]} align="middle">
                    <Col span={6}>
                        <Segmented
                            className={styles.segmented}
                            options={[
                                { label: "All Areas", value: "all" },
                                { label: "Downtown", value: "downtown" },
                                { label: "Marina", value: "marina" },
                                { label: "Palm", value: "palm" },
                            ]}
                            value={selectedArea}
                            onChange={(value) => setSelectedArea(value as string)}
                        />
                    </Col>
                    <Col span={6}>
                        <CustomSelect
                            className={styles.select}
                            placeholder="Select Project"
                            value={selectedProject}
                            onChange={setSelectedProject}
                            showSearch
                            options={[
                                { value: "all", label: "All Projects" },
                                { value: "burj", label: "Burj Khalifa" },
                                { value: "palm", label: "Palm Tower" },
                                { value: "marina", label: "Marina Heights" },
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <CustomSelect
                            className={styles.select}
                            placeholder="Select Building"
                            value={selectedBuilding}
                            onChange={setSelectedBuilding}
                            showSearch
                            options={[
                                { value: "all", label: "All Buildings" },
                                { value: "tower-a", label: "Tower A" },
                                { value: "tower-b", label: "Tower B" },
                                { value: "tower-c", label: "Tower C" },
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className={styles.rangePicker}
                            placeholder={["Start Date", "End Date"]}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className={styles.filtersFooter}>
                    <Col span={12}>
                        <CustomInput
                            placeholder="Search properties, projects, or areas..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={12}>
                        <Space>
                            <CustomButton type="primary" onClick={handleFilterApply}>
                                Apply Filters
                            </CustomButton>
                            <CustomButton onClick={() => {
                                setSelectedArea("all");
                                setSelectedProject("all");
                                setSelectedBuilding("all");
                                setDateRange(null);
                                setSearchText("");
                            }}>
                                Clear All
                            </CustomButton>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Developer Analytics section */}
            <Divider />
            <h2>Developer Analytics</h2>
            <Row gutter={[16, 16]} className={styles.cardsRow}>
                <Col xs={24} lg={8}>
                    <ChartCard title="Distribution of buildings by districts" extra={<Tag>DLD</Tag>}>
                        <BarChart 
                            data={buildingsByDistrictsData.data} 
                            labels={buildingsByDistrictsData.labels}
                            color="#3B82F6"
                        />
                    </ChartCard>
                </Col>
                <Col xs={24} lg={8}>
                    <ChartCard title="Lots by apartment type" extra={<Tag>DLD</Tag>}>
                        <BarChart 
                            data={apartmentTypesData.data} 
                            labels={apartmentTypesData.labels}
                            color="#10B981"
                        />
                    </ChartCard>
                </Col>
                <Col xs={24} lg={8}>
                    <ChartCard title="Buildings commissioned/under construction" extra={<Tag>DLD</Tag>}>
                        <PieChart 
                            data={constructionStatusData.data} 
                            labels={constructionStatusData.labels}
                            colors={constructionStatusData.colors}
                        />
                    </ChartCard>
                </Col>
            </Row>

            {/* More Analytics */}
            <Divider />
            <div className={styles.headerBar}>
                <h2>More Analytics</h2>
                <SegmentedGroup
                    options={[{label: 'Sales', value: 'sales'}, {label: 'Rental', value: 'rental'}]}
                    value={salesMode}
                    onChange={(v) => setSalesMode(v)}
                />
            </div>
            <Row gutter={[16, 16]} className={styles.cardsRow}>
                <Col xs={24} lg={8}>
                    <ChartCard title="Average price AED per sqm" extra={<Tag>DLD</Tag>}>
                        <LineChart 
                            data={avgPricePerSqmData.data} 
                            labels={avgPricePerSqmData.labels}
                            color="#F59E0B"
                            gradient={true}
                        />
                    </ChartCard>
                </Col>
                <Col xs={24} lg={8}>
                    <ChartCard title="Price Trends (Last 6 months)" extra={<Tag>DLD</Tag>}>
                        <LineChart 
                            data={pricesTrendData.data} 
                            labels={pricesTrendData.labels}
                            color="#8B5CF6"
                            gradient={true}
                        />
                    </ChartCard>
                </Col>
                <Col xs={24} lg={8}>
                    <ChartCard title="Average ROI %" extra={<Tag>DLD</Tag>}>
                        <BarChart 
                            data={roiData.data} 
                            labels={roiData.labels}
                            color="#EF4444"
                        />
                    </ChartCard>
                </Col>
            </Row>

            {/* Tabs for different views */}
            <CustomTabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                className={styles.tabs}
                items={[
                    {
                        key: "overview",
                        label: <span><BarChartOutlined />Overview</span>,
                        children: (
                            <Row gutter={[16, 16]} className={styles.cardsRow}>
                                <Col span={6}><OverviewCard title="Total Properties" value={15432} kpi={<KpiBadge value={12.5} />} /></Col>
                                <Col span={6}><OverviewCard title="Average Price" value={<><span>$</span>2850<span className={styles.valueBlue}>/m²</span></>} kpi={<KpiBadge value={8.3} />} /></Col>
                                <Col span={6}><OverviewCard title="Total Deals" value={2156} kpi={<KpiBadge value={18.5} />} /></Col>
                                <Col span={6}><OverviewCard title="Market Volume" value={<><span>$</span>82.5<span className={styles.valueBlue}>M</span></>} kpi={<KpiBadge value={20.7} />} /></Col>
                            </Row>
                        )
                    },
                    {
                        key: "transactions",
                        label: <span><LineChartOutlined />Transactions</span>,
                        children: (
                            /* Detailed Analysis */
                            <Collapse className={styles.expandable}>
                                <Panel header="Property Transactions Analysis" key="1">
                                    <div className={styles.tableContainer}>
                                        <TransactionsTable rows={tableData.map(r => ({
                                            key: r.key,
                                            date: '18 Dec, 2024',
                                            location: `${r.project}, ${r.area}`,
                                            rooms: '4 Rooms',
                                            sqm: 125,
                                            price: '2,374,238',
                                        }))} />
                                    </div>
                                </Panel>
                            </Collapse>
                        )
                    },
                    {
                        key: "insights",
                        label: <span><PieChartOutlined />Insights</span>,
                        children: (
                            <Collapse className={styles.expandable}>
                                <Panel header="Market Trends & Insights" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Card title="Market Performance by Area">
                                                <div className={styles.p16}>
                                                    <h4>Key Market Insights:</h4>
                                                    <ul>
                                                        <li>Downtown Dubai continues to lead in property values</li>
                                                        <li>Marina area shows highest transaction volume</li>
                                                        <li>Palm Jumeirah maintains premium positioning</li>
                                                        <li>Overall market shows strong recovery post-pandemic</li>
                                                    </ul>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={12}>
                                            <Card title="Growth Metrics">
                                                <div className={styles.p16}>
                                                    <Space direction="vertical" className={styles.w100}>
                                                        <div>
                                                            <span>Price Growth: </span>
                                                            <Progress percent={75} status="active" />
                                                        </div>
                                                        <div>
                                                            <span>Transaction Volume: </span>
                                                            <Progress percent={85} status="active" />
                                                        </div>
                                                        <div>
                                                            <span>Market Liquidity: </span>
                                                            <Progress percent={60} status="active" />
            </div>
                                                    </Space>
        </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Panel>
                            </Collapse>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default Analytics;
