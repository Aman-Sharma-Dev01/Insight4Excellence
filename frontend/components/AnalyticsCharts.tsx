
// Fix: Use namespace import for React to ensure JSX types are correctly resolved
import * as React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area
} from 'recharts';
import { AggregatedData } from '../types';
import { Users, BookOpen, Layers, TrendingUp, Award, BarChart2 } from 'lucide-react';

interface ChartsProps {
  data: AggregatedData;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
const RATING_COLORS = {
  exceptional: '#10b981',
  outstanding: '#3b82f6',
  good: '#f59e0b',
  average: '#ef4444'
};

const AnalyticsCharts: React.FC<ChartsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState<'faculty' | 'courses' | 'sections' | 'parameters'>('faculty');

  const {
    questionScores = [],
    departmentWise = [],
    facultyScores = [],
    sectionWise = [],
    courseWise = [],
    timeTrends = []
  } = data;

  if (!questionScores.length && !facultyScores.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-500">No data available for charts.</p>
      </div>
    );
  }

  // Prepare faculty comparison data (top 10)
  const facultyChartData = facultyScores.slice(0, 10).map(f => ({
    name: f.name.length > 15 ? f.name.substring(0, 15) + '...' : f.name,
    fullName: f.name,
    score: f.score,
    feedbacks: f.feedbackCount || 0
  }));

  // Prepare course comparison data
  const courseChartData = (courseWise || []).slice(0, 10).map(c => ({
    name: c.courseName.length > 20 ? c.courseName.substring(0, 20) + '...' : c.courseName,
    fullName: c.courseName,
    score: c.averageScore,
    feedbacks: c.feedbackCount
  }));

  // Prepare section comparison data
  const sectionChartData = (sectionWise || []).slice(0, 10).map(s => ({
    name: `${s.section}`,
    fullName: `${s.section} - ${s.course}`,
    score: s.averageScore,
    feedbacks: s.feedbackCount
  }));

  // Prepare radar chart data for parameters
  const radarData = questionScores.slice(0, 8).map((q, idx) => ({
    parameter: `P${idx + 1}`,
    fullName: q.question,
    score: q.score,
    fullMark: 5
  }));

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 4.81) return RATING_COLORS.exceptional;
    if (score >= 4.41) return RATING_COLORS.outstanding;
    if (score >= 4.00) return RATING_COLORS.good;
    return RATING_COLORS.average;
  };

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-800">{data.fullName || label}</p>
          <p className="text-sm text-indigo-600">
            Score: <strong>{payload[0].value?.toFixed(2)}</strong>/5.0
          </p>
          {data.feedbacks !== undefined && (
            <p className="text-xs text-slate-500">Feedbacks: {data.feedbacks}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'faculty'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Users className="w-4 h-4" /> Faculty Comparison
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <BookOpen className="w-4 h-4" /> Course Analysis
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'sections'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Layers className="w-4 h-4" /> Section Analysis
          </button>
          <button
            onClick={() => setActiveTab('parameters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'parameters'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <BarChart2 className="w-4 h-4" /> Parameter Scores
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty/Course/Section Comparison Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            {activeTab === 'faculty' && <><Users className="w-5 h-5 text-indigo-600" /> Faculty Performance Ranking</>}
            {activeTab === 'courses' && <><BookOpen className="w-5 h-5 text-indigo-600" /> Course-wise Average Scores</>}
            {activeTab === 'sections' && <><Layers className="w-5 h-5 text-indigo-600" /> Section-wise Performance</>}
            {activeTab === 'parameters' && <><BarChart2 className="w-5 h-5 text-indigo-600" /> Feedback Parameter Scores</>}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {activeTab === 'faculty' && `Comparing performance of top ${facultyChartData.length} faculty members based on student feedback`}
            {activeTab === 'courses' && `Average feedback scores across ${courseChartData.length} courses`}
            {activeTab === 'sections' && `Performance comparison across ${sectionChartData.length} sections`}
            {activeTab === 'parameters' && `Average scores for each feedback parameter`}
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'parameters' ? (
                <BarChart data={questionScores} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis
                    dataKey="question"
                    type="category"
                    width={200}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => value.length > 35 ? value.substring(0, 35) + '...' : value}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="score"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {questionScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <ComposedChart
                  data={
                    activeTab === 'faculty' ? facultyChartData :
                      activeTab === 'courses' ? courseChartData :
                        sectionChartData
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={70} />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="score" name="Score" radius={[4, 4, 0, 0]} barSize={30}>
                    {(activeTab === 'faculty' ? facultyChartData :
                      activeTab === 'courses' ? courseChartData :
                        sectionChartData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                        ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="feedbacks" name="Feedbacks" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Parameter Overview</h3>
          <p className="text-sm text-slate-500 mb-4">Radar view of feedback parameters</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="parameter" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), 'Score']}
                  labelFormatter={(label) => radarData.find(d => d.parameter === label)?.fullName || label}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p className="font-medium mb-1">Parameter Key:</p>
            <div className="grid grid-cols-2 gap-1">
              {radarData.map((d, i) => (
                <span key={i} className="truncate" title={d.fullName}>
                  <strong>{d.parameter}</strong>: {d.fullName.substring(0, 30)}...
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Faculty Rating Distribution</h3>
          <p className="text-sm text-slate-500 mb-4">Performance category breakdown</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Exceptional (4.81-5.00)', value: facultyScores.filter(f => f.score >= 4.81).length, color: RATING_COLORS.exceptional },
                    { name: 'Outstanding (4.41-4.80)', value: facultyScores.filter(f => f.score >= 4.41 && f.score < 4.81).length, color: RATING_COLORS.outstanding },
                    { name: 'Good (4.00-4.40)', value: facultyScores.filter(f => f.score >= 4.00 && f.score < 4.41).length, color: RATING_COLORS.good },
                    { name: 'Average (1.00-3.99)', value: facultyScores.filter(f => f.score < 4.00).length, color: RATING_COLORS.average }
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                >
                  {[
                    { name: 'Exceptional', color: RATING_COLORS.exceptional },
                    { name: 'Outstanding', color: RATING_COLORS.outstanding },
                    { name: 'Good', color: RATING_COLORS.good },
                    { name: 'Average', color: RATING_COLORS.average }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Trends */}
        {timeTrends.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Feedback Trends Over Time
            </h3>
            <p className="text-sm text-slate-500 mb-6">Weekly average feedback scores</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[3, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Average Score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#6366f1' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
