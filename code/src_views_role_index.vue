<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchForm"
      class="demo-form-inline flex justify-end mb-4 items-start"
      size="mini"
    >
      <div v-if="isPermissionCode('role_pageQueryRoles,role_pageQueryRoles')" class="inline-block">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="所属应用" prop="app">
          <el-select
            v-model="searchForm.appId"
            placeholder="请选择所属应用"
            clearable
            style="width: 100%"
          >
            <el-option v-for="app in appList" :key="app.id" :label="app.name" :value="app.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button style="border-color:#3B91FF;color:#3B91FF" @click="handleResetForm('searchForm')">重置</el-button>
        </el-form-item>
      </div>
      <el-button
        v-if="isPermissionCode('role_addRole')"
        type="primary"
        size="mini"
        @click="handleAddRole()"
        style="margin-left: auto"
        >新增</el-button
      >
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="roleList"
      style="width: 100%"
      row-key="id"
      border
      stripe
      :header-cell-style="{
        background: '#f0f7fc',
        color: '#606266',
        textAlign: 'center',
      }"
      :cell-style="{ textAlign: 'center', padding: '0px' }"
      :row-style="{ height: '46px' }"
    >
      <el-table-column align="center" prop="name" label="角色名称" />
      <el-table-column align="center" prop="appName" label="所属应用" />
      <el-table-column align="center" prop="code" label="角色编号" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isPermissionCode('role_updateRole')"
            type="text"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="isPermissionCode('role_deleteRoleById')"
            type="text"
            @click="handleRemove(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="isPermissionCode('role_getDetailById')"
            type="text"
            @click="handleView(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end">
      <el-pagination
        style="float: right; margin-top: 5px"
        background
        :current-page.sync="pageable.page"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageable.size"
        :page-sizes="[10, 20, 30]"
        :total="pageable.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      lock-scroll
      :visible.sync="dialogVisible"
      :title="editableDisable ? '查看角色' : currentItem.id ? '编辑角色' : '新增角色'"
      width="600px"
      center
      :close-on-click-modal="false"
      @closed="() => handleResetForm('editRoleForm')"
    >
      <el-form
        ref="editRoleForm"
        class="roleTree"
        :model="currentItem"
        label-width="100px"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input
            v-model="currentItem.name"
            :disabled="editableDisable"
            placeholder="请输入角色名称"
            :maxlength="20"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item label="角色编码：" prop="name">
          <el-input
            v-model="currentItem.code"
            :disabled="currentItem.id ? true : false"
            placeholder="请输入角色编码"
          />
        </el-form-item>
        <el-form-item label="角色备注：" prop="description">
          <el-input
            v-model="currentItem.description"
            type="textarea"
            :disabled="editableDisable"
            placeholder="请输入角色备注"
            :maxlength="100"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item label="所属应用：" prop="appId">
          <el-select
            v-model="currentItem.appId"
            :disabled="currentItem.id ? true : false"
            placeholder="请选择所属应用"
            style="width: 100%"
            @change="handleSelectApp"
          >
            <el-option v-for="app in appList" :key="app.id" :label="app.name" :value="app.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12">
          <h3 style="margin-top: 0">菜单选择</h3>
          <div v-loading="resourseLoading" class="grid-content">
            <el-scrollbar style="height: 100%">
              <el-tree
                ref="menuTree"
                :data="menuTreeData"
                show-checkbox
                node-key="id"
                :props="{ label: 'name' }"
                default-expand-all
                :expand-on-click-node="false"
                :default-checked-keys="defaultMenuChecked"
                @node-click="handleMenuNodeClick"
                @check-change="handleMenuCheckbox"
              />
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="12">
          <diV class="flex justify-between">
            <h3 style="margin-top: 0">功能选择</h3>
          </diV>
          <div class="grid-content">
            <el-scrollbar style="height: 100%; padding: 10px">
              <el-checkbox-group
                v-if="currentMenuItemSubFunctions.length > 0"
                v-model="checkedFunctions"
              >
                <el-checkbox
                  v-for="func in currentMenuItemSubFunctions"
                  :key="func.id"
                  :label="func.id"
                  @change="(flag) => handleFunctionChange(flag, func)"
                  style="display: block; margin-bottom: 3px"
                  :disabled="showType === 'view'"
                >
                  {{ func.name }}
                </el-checkbox>
              </el-checkbox-group>
              <div v-else style="color: #909399; text-align: center; margin-top: 7px">暂无数据</div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
      <div class="text-center mt-4">
        <el-button v-if="showType !== 'view'" type="primary" @click="handleSaveRole"
          >保存</el-button
        >
        <el-button v-if="showType !== 'view'" @click="dialogVisible = false">取消</el-button>
        <el-button v-if="showType === 'view'" @click="dialogVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  updateRole,
  deleteRole,
  addRole,
  roleInUse,
  roleDetails,
  getAppsForManageRole,
  getAppResources,
} from '@/api/role'
let timer = null
export default {
  name: 'Role',
  data() {
    return {
      dialogVisible: false,
      // 表格的loading状态
      tableLoading: false,
      // 当前弹窗显示的类型 // add => 新增 update => 编辑 view => 查看
      showType: 'view',
      // 搜索过滤数据
      searchForm: {
        name: '',
        appId: '',
      },
      // 分页
      pageable: {
        page: 1,
        size: 10,
        total: 0,
      },
      appList: [],
      roleList: [],
      currentItem: {},
      // 当前菜单项对应的所有功能集合
      currentMenuItemSubFunctions: [],
      // 选中的菜单功能
      checkedFunctions: [],
      menuTreeData: [],
      defaultMenuChecked: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
        appId: [{ required: true, trigger: 'blur', message: '请选择所属应用' }],
      },
      // 菜单树数据加载
      resourseLoading: false,
      // 菜单项与功能映射Map, 用于展示右侧功能列表, 实现全选等功能
      menuSubFunctionsMaps: Object.create(null),
      currentClickMenuItemId: undefined,
      isFunctionItemClick: false,
      // 功能选中的数量
      checkCount: 0,
    }
  },
  computed: {
    // 菜单树禁用状态,只有在编辑模式下为禁用
    editableDisable() {
      return this.showType === 'view'
    },
  },
  watch: {
    currentClickMenuItemId: function (n) {
      console.log('变化了0----------------------------------------')
      this.checkCount = 0
      if (this.menuSubFunctionsMaps[n]) {
        this.menuSubFunctionsMaps[n].forEach((item) => {
          if (this.checkedFunctions.includes(item.id)) {
            // console.log(item.id)
            this.checkCount += 1
          }
        })
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化获取列表数据
    init() {
      this.loadRoleList()
      this.loadAppList()
    },
    // 获取app列表
    loadAppList() {
      getAppsForManageRole().then((res) => {
        if (res.code === 0) {
          this.appList = res.data
        }
      })
    },
    // 获取用户列表
    loadRoleList(page = 1, name = '', appId = '', size = 10) {
      if (timer) return
      this.tableLoading = true
      getRoles(name, appId, page, size)
        .then((res) => {
          if (res.code === 0) {
            const { data, total, current } = res.data
            this.tableLoading = false
            this.roleList = data || []
            // 同步分页信息
            this.pageable.total = total
            this.pageable.page = current
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
      // 节流处理
      timer = setTimeout(() => {
        timer = null
      }, 100)
    },
    // 重置搜索表单
    handleResetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 搜索
    handleSearch() {
      const { name, appId } = this.searchForm
      this.loadRoleList(1, name, appId, this.pageable.size)
    },
    // 分页大小改变
    handleSizeChange(size) {
      this.pageable.size = size
      const { name, appId } = this.searchForm
      this.loadRoleList(1, name, appId, this.pageable.size)
    },
    // 页码改变
    handleCurrentChange(page) {
      this.pageable.page = page
      const { name, appId } = this.searchForm
      this.loadRoleList(page, name, appId, this.pageable.size)
    },
    // 新增角色
    handleAddRole() {
      this.showType = 'add'
      this.currentItem = {
        name: '',
        appId: '',
        description: '',
        resourceIds: [],
      }
      this.menuTreeData = []
      this.defaultMenuChecked = []
      this.currentMenuItemSubFunctions = []
      this.dialogVisible = true
    },
    // 删除角色
    handleRemove(itemData) {
      const { id } = itemData
      roleInUse(id).then((res) => {
        var message = res.data ? '角色在使用中，是否确认删除' : '当前角色未被使用，是否确认删除'
        this.$confirm(message, '温馨提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // if click make sure,call deleteRole api
            deleteRole(id).then(() => {
              this.$message.success('删除成功！')
              this.init()
            })
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
      })
    },
    // 编辑角色
    handleUpdate(itemData) {
      const { id } = itemData
      roleDetails(id).then((res) => {
        this.currentItem = res.data
        this.showType = 'update'
        this.dialogVisible = true
        this.handleSelectApp()
      })
    },
    // 查看角色
    handleView(itemData) {
      const { id } = itemData
      roleDetails(id).then((res) => {
        this.currentItem = res.data
        this.showType = 'view'
        this.dialogVisible = true
        this.handleSelectApp()
      })
    },
    // 获取菜单树层级数据结构
    getMenuTreeData(list, parentId = undefined) {
      const parentObj = {}
      list.forEach((o) => {
        parentObj[o.id] = o
      })
      if (!parentId) {
        return list
          .filter((o) => !parentObj[o.parentId])
          .map((o) => {
            o.disabled = this.editableDisable
            o.children = this.getMenuTreeData(list, o.id)
            return o
          })
      } else {
        return list
          .filter((o) => o.parentId === parentId)
          .map((o) => {
            o.disabled = this.editableDisable
            o.children = this.getMenuTreeData(list, o.id)
            return o
          })
      }
    },
    // 下拉菜单选中app
    handleSelectApp() {
      const { appId } = this.currentItem
      // 根据app获取资源列表
      const tempDefaultMenuChecked = []
      const menuData = []
      this.resourseLoading = true
      this.currentMenuItemSubFunctions = []
      this.checkedFunctions = []
      this.allResourceIds = []
      this.menuSubFunctionsMaps = Object.create(null)
      // 接口获取资源
      getAppResources(appId).then((res) => {
        this.resourseLoading = false
        const { data } = res
        if (data.length) {
          // 初始化菜单,功能数据,以及选中状态
          data.forEach((item) => {
            const { resourceIds: currentItemCheckedIds } = this.currentItem
            if (item.type === 1) {
              // 如果类型是菜单
              menuData.push(item)
              // 勾选
              if (currentItemCheckedIds.includes(item.id)) {
                tempDefaultMenuChecked.push(item.id)
              }
            } else if (item.type === 2) {
              // 获取映射树
              if (this.menuSubFunctionsMaps[item.parentId]) {
                this.menuSubFunctionsMaps[item.parentId].push(item)
              } else {
                this.menuSubFunctionsMaps[item.parentId] = [item]
              }
              // 勾选
              if (currentItemCheckedIds.includes(item.id)) {
                this.checkedFunctions.push(item.id)
              }
            }
          })
          const menuTreeData = this.getMenuTreeData(menuData)

          //   console.log('选中的叶子节点', halfIds)
          //   console.log('当前item', this.currentItem)
          //   console.log(this.editableDisable)

          // 处理叶子节点,避免叶子节点选中,子节点只是选中一部分,出现子节点全部选中的问题
          const halfIds = menuTreeData.filter((item) => item.children.length).map((item) => item.id)
          this.menuTreeData = menuTreeData
          this.defaultMenuChecked = tempDefaultMenuChecked.filter((id) => {
            if (!halfIds.includes(id)) {
              return true
            }
          })
        }
      })
    },
    // 菜单节点点击, 旁边的字, 非复选框点击
    handleMenuNodeClick(data) {
      //   console.log(data)
      const { id } = data
      const functionList = this.menuSubFunctionsMaps[id]
      console.log(functionList)
      if (functionList) {
        this.currentClickMenuItemId = id
        this.currentMenuItemSubFunctions = functionList
      } else {
        this.currentMenuItemSubFunctions = []
      }
    },
    // 菜单复选框点击
    handleMenuCheckbox(data, flag) {
      const { id, children } = data
      const functionList = this.menuSubFunctionsMaps[id]
      this.$refs['menuTree'].setCurrentKey(id)
      if (functionList) {
        this.currentClickMenuItemId = id
        this.currentMenuItemSubFunctions = functionList

        if (flag) {
          !children.length && this.defaultMenuChecked.push(id)
          // 如果是选中,全选功能
          console.log(this.isFunctionItemClick, '------------------------')
          if (!this.isFunctionItemClick) {
            this.checkCount = functionList.length
            console.log(this.isFunctionItemClick)
            functionList.forEach((item) => {
              if (!this.checkedFunctions.includes(item.id)) {
                this.checkedFunctions.push(item.id)
              }
            })
          }
        } else {
          this.checkCount = 0
          // 判断没有子节点,说明是最小菜单项,菜单选中的列表中
          !children.length && this.defaultMenuChecked.splice(this.defaultMenuChecked.indexOf(id), 1)
          // 非选中,移除全选
          functionList.forEach((item) => {
            const index = this.checkedFunctions.indexOf(item.id)
            index > -1 && this.checkedFunctions.splice(index, 1)
          })
        }
        // console.log(this.defaultMenuChecked)
      }
    },
    // 功能点击
    handleFunctionChange(flag, data) {
      //   console.log(data, flag)
      const { parentId } = data
      if (flag) {
        this.isFunctionItemClick = true
        this.checkCount += 1
        this.$refs['menuTree'].setCheckedKeys([...this.defaultMenuChecked, parentId])
      } else {
        this.checkCount -= 1
        if (this.checkCount === 0) {
          this.$refs['menuTree'].setChecked(this.currentClickMenuItemId, false)
          //   console.log('全部取消勾选了', this.currentClickMenuItemId)
        }
      }
      // 200毫秒后恢复 isFunctionItemClick 状态
      setTimeout(() => {
        this.isFunctionItemClick = false
      }, 200)
      //   console.log(this.checkCount)
    },
    handleSaveRole() {
      this.$refs.editRoleForm.validate((valid) => {
        if (valid) {
          // 获取选中的子节点
          const nodes = this.$refs.menuTree.getCheckedNodes()
          // 获取选中/半选中的叶子节点
          const halfNodes = this.$refs.menuTree.getHalfCheckedNodes()
          // 取到所有选中的子节点id
          this.currentItem.resourceIds = [
            ...halfNodes.map((node) => node.id),
            ...nodes.map((node) => node.id),
            ...this.checkedFunctions,
          ]
          console.log(this.defaultMenuChecked.length)
          // 检查是否选中至少一个
          if (this.showType === 'add' || this.showType === 'update') {
            if (!this.defaultMenuChecked.length) {
              this.$message.warning('角色至少拥有一个菜单项')
              return false
            }
          }
          switch (this.showType) {
            case 'add':
              addRole(this.currentItem).then(() => {
                this.$message.success('添加成功！')
                this.handleSearch()
                this.dialogVisible = false
              })
              break
            case 'update':
              updateRole(this.currentItem).then(() => {
                this.$message.success('修改成功！')
                this.handleSearch()
                this.dialogVisible = false
              })
              break
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.grid-content {
  width: 100%;
  height: 260px;
  border: 1px solid #ddd;
  border-radius: 2px;
}
</style>
